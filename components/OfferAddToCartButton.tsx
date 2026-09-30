"use client";

type ProductForCart = {
  id: string;
  name: string;
  price: string;
  currency: string;
  image?: string;
  stock: number;
};

type CartItem = { id: string; name: string; price: string; currency: string; image?: string; quantity: number };
const CART_KEY = "trendeco-cart";

function gaEvent(name: string, params: Record<string, unknown>) {
  window.gtag?.("event", name, params);
}

export default function OfferAddToCartButton({ product }: { product: ProductForCart }) {
  function addToCart() {
    try {
      const value = Number.parseFloat(String(product.price).replace(",", ".")) || 0;
      gaEvent("add_to_cart", { currency: product.currency || "PLN", value, items: [{ item_id: product.id, item_name: product.name, price: value, quantity: 1 }] });
      const items = JSON.parse(localStorage.getItem(CART_KEY) || "[]") as CartItem[];
      const existing = items.find((item) => item.id === product.id);
      const next = existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { id: product.id, name: product.name, price: product.price, currency: product.currency, image: product.image, quantity: 1 }];
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("trendeco-cart-updated"));
    } finally {
      window.location.href = "/koszyk";
    }
  }

  return (
    <button
      type="button"
      disabled={product.stock <= 0}
      onClick={addToCart}
      className="mt-8 block w-full rounded-full bg-green-600 px-6 py-4 text-center text-lg font-black text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-zinc-400"
    >
      {product.stock > 0 ? "Dodaj do koszyka — darmowa dostawa, płatność przy odbiorze" : "Chwilowo niedostępne"}
    </button>
  );
}
