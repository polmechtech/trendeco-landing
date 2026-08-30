"use client";

import { useEffect, useState } from "react";

type Consent = "accepted" | "rejected" | null;
const KEY = "trendeco-cookie-consent";

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }

function updateGoogle(granted: boolean) {
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as Consent;
    if (saved === "accepted" || saved === "rejected") {
      setConsent(saved);
      updateGoogle(saved === "accepted");
    }
    setReady(true);
  }, []);

  function choose(value: Exclude<Consent, null>) {
    localStorage.setItem(KEY, value);
    setConsent(value);
    updateGoogle(value === "accepted");
  }

  function reset() {
    localStorage.removeItem(KEY);
    setConsent(null);
    updateGoogle(false);
  }

  if (!ready) return null;

  return <>
    {consent === null && <div role="dialog" aria-label="Ustawienia plików cookies" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl sm:bottom-5 sm:p-6">
      <h2 className="text-lg font-black">Pliki cookies i prywatność</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">Używamy niezbędnych mechanizmów do działania sklepu. Za Twoją zgodą używamy również Google Analytics, aby mierzyć ruch i ulepszać serwis. Możesz zaakceptować lub odrzucić analitykę. Odrzucenie nie ogranicza możliwości korzystania ze sklepu ani złożenia zamówienia.</p>
      <p className="mt-2 text-xs text-zinc-500">Więcej informacji znajdziesz w <a href="/polityka-prywatnosci" className="font-bold underline">Polityce prywatności i RODO</a>.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => choose("rejected")} className="min-h-12 rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm font-black text-zinc-900">Odrzuć analityczne</button>
        <button type="button" onClick={() => choose("accepted")} className="min-h-12 rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white">Akceptuję analityczne</button>
      </div>
    </div>}
    {consent !== null && <button type="button" onClick={reset} className="fixed bottom-3 left-3 z-40 rounded-full border border-zinc-300 bg-white px-3 py-2 text-[11px] font-bold text-zinc-700 shadow-md sm:bottom-5 sm:left-5" aria-label="Zmień ustawienia cookies">Ustawienia cookies</button>}
  </>;
}
