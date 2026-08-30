"use client";

import { useEffect, useState } from "react";

type ErliInfo = { price: string; currency: string; url: string };

export default function OfferMarketplaceButtons({ offerId, allegroUrl }: { offerId: string; allegroUrl: string }) {
  const [erli, setErli] = useState<ErliInfo | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    fetch(`/api/erli/prices?ids=${encodeURIComponent(offerId)}`, { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: Record<string, ErliInfo> | null) => {
        if (active && data?.[offerId]?.url) setErli(data[offerId]);
      })
      .catch(() => {});

    return () => {
      active = false;
      controller.abort();
    };
  }, [offerId]);

  return (
    <>
      {erli && (
        <a
          href={erli.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-3 flex min-h-10 items-center justify-center rounded-full bg-[#00B8B0] px-4 py-3 text-center text-sm font-black text-white"
        >
          Kup na ERLI
        </a>
      )}
      <a
        href={allegroUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-3 flex min-h-10 items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white"
      >
        Kup na Allegro
      </a>
    </>
  );
}
