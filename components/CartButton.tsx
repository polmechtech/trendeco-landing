"use client";

import { useEffect, useState } from "react";

const CART_KEY = "trendeco-cart";

type CartItem = { id: string; quantity: number };

function readCount() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || "[]") as CartItem[];
    return items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
  } catch {
    return 0;
  }
}

export default function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(readCount());
    update();
    window.addEventListener("trendeco-cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("trendeco-cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <a href="/koszyk" aria-label={`Koszyk, produktów: ${count}`} className="fixed bottom-24 right-4 z-50 flex h-14 min-w-14 items-center justify-center rounded-full bg-zinc-950 px-4 text-white shadow-2xl ring-2 ring-white/80 transition hover:scale-105 sm:bottom-24 sm:right-6">
      <span className="text-xl" aria-hidden="true">🛒</span>
      {count > 0 && <span className="ml-2 min-w-6 rounded-full bg-orange-500 px-1.5 py-0.5 text-center text-xs font-black">{count}</span>}
    </a>
  );
}
