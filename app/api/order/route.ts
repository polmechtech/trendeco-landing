import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import type { AllegroProduct } from "@/lib/allegro";

export const dynamic = "force-dynamic";

type OrderRequest = {
  items: { id: string; quantity: number }[];
  customer: { name: string; company?: string; nip?: string; phone: string; email: string; street: string; postalCode: string; city: string; notes?: string; invoice?: boolean };
  payment: "cash_on_delivery";
};

function discountedPrice(product: AllegroProduct) {
  const price = Number.parseFloat(String(product.price).replace(",", "."));
  if (!Number.isFinite(price)) return 0;
  const discounted = price * 0.95;
  return Math.max(9, Math.floor((discounted + 1) / 10) * 10 - 1);
}

function esc(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c] || c));
}

function orderNumber() {
  const d = new Date();
  const date = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `TE-${date}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

async function sendEmail(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "TrendEco <mail@trendeco.eu>", to, subject, html }),
  });
  return response.ok;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest;
    const c = body.customer;
    if (!body.items?.length || body.payment !== "cash_on_delivery" || !c?.name || !c?.phone || !c?.email || !c?.street || !c?.postalCode || !c?.city) {
      return NextResponse.json({ error: "Uzupełnij wszystkie wymagane dane." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(c.email)) return NextResponse.json({ error: "Nieprawidłowy adres e-mail." }, { status: 400 });

    const productsResponse = await fetch("https://trendeco.eu/api/allegro/offers", { cache: "no-store" });
    if (!productsResponse.ok) return NextResponse.json({ error: "Nie udało się potwierdzić aktualnej oferty." }, { status: 503 });
    const products = (await productsResponse.json()) as AllegroProduct[];
    const normalized = body.items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      const quantity = Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1)));
      if (!product || product.stock <= 0 || quantity > product.stock) return null;
      return { id: product.id, name: product.name, quantity, unitPrice: discountedPrice(product), currency: product.currency || "PLN" };
    });
    if (normalized.some((item) => !item)) return NextResponse.json({ error: "Jeden z produktów jest niedostępny lub ilość przekracza stan magazynowy." }, { status: 409 });
    const orderItems = normalized.filter(Boolean) as NonNullable<(typeof normalized)[number]>[];
    const currency = orderItems[0]?.currency || "PLN";
    const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const number = orderNumber();
    const createdAt = new Date().toISOString();
    const order = { orderNumber: number, createdAt, payment: "cash_on_delivery", status: "new", customer: c, items: orderItems, total, currency, shippingCost: null };

    let stored = false;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (redisUrl && redisToken) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken });
        await redis.set(`order:${number}`, order);
        await redis.lpush("orders:trendeco", number);
        stored = true;
      } catch (error) {
        console.error("Order Redis storage failed", error);
      }
    }

    const rows = orderItems.map((item) => `<tr><td style="padding:8px;border-bottom:1px solid #ddd">${esc(item.name)}</td><td style="padding:8px;border-bottom:1px solid #ddd;text-align:center">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #ddd;text-align:right">${item.unitPrice.toFixed(2)} ${esc(item.currency)}</td></tr>`).join("");
    const common = `<h2>Zamówienie ${esc(number)}</h2><table style="border-collapse:collapse;width:100%"><tr><th align="left">Produkt</th><th>Ilość</th><th align="right">Cena</th></tr>${rows}</table><p><strong>Razem: ${total.toFixed(2)} ${esc(currency)}</strong></p><p>Płatność: za pobraniem.<br>Koszt dostawy zostanie potwierdzony przed realizacją.</p>`;
    const customerHtml = `<p>Dzień dobry ${esc(c.name)},</p><p>otrzymaliśmy Twoje zamówienie. Poniżej znajduje się jego podsumowanie.</p>${common}<p>Dostawa: ${esc(c.street)}, ${esc(c.postalCode)} ${esc(c.city)}</p><p>Skontaktujemy się w celu potwierdzenia dostępności i kosztu dostawy.</p><p>TrendEco<br>tel. +48 512 077 770<br>mail@trendeco.eu</p>`;
    const adminHtml = `<p><strong>NOWE ZAMÓWIENIE ZA POBRANIEM</strong></p>${common}<p><strong>Klient:</strong> ${esc(c.name)}<br><strong>Telefon:</strong> ${esc(c.phone)}<br><strong>E-mail:</strong> ${esc(c.email)}<br><strong>Adres:</strong> ${esc(c.street)}, ${esc(c.postalCode)} ${esc(c.city)}${c.invoice ? `<br><strong>Firma:</strong> ${esc(c.company)}<br><strong>NIP:</strong> ${esc(c.nip)}` : ""}${c.notes ? `<br><strong>Uwagi:</strong> ${esc(c.notes)}` : ""}</p>`;

    const [customerSent, adminSent] = await Promise.all([
      sendEmail([c.email], `TrendEco — potwierdzenie zamówienia ${number}`, customerHtml),
      sendEmail(["mail@trendeco.eu"], `NOWE ZAMÓWIENIE ${number}`, adminHtml),
    ]);

    if (!customerSent || !adminSent) {
      return NextResponse.json({ error: "Nie udało się wysłać potwierdzenia zamówienia. Sprawdź konfigurację poczty lub skontaktuj się z nami telefonicznie." }, { status: 503 });
    }

    return NextResponse.json({ ok: true, orderNumber: number, emailSent: true, stored });
  } catch (error) {
    console.error("Order creation failed", error);
    return NextResponse.json({ error: "Nie udało się złożyć zamówienia. Spróbuj ponownie lub skontaktuj się z nami." }, { status: 500 });
  }
}
