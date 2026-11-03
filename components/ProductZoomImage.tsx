"use client";

import { useEffect, useState } from "react";

export default function ProductZoomImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={`Powiększ zdjęcie: ${alt}`} className="flex h-full w-full cursor-zoom-in items-center justify-center">
      <img src={src} alt={alt} loading="lazy" className={`max-h-full max-w-full object-contain ${className}`} />
    </button>
    {open && <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(false)}>
      <button type="button" className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-lg font-bold text-black" onClick={() => setOpen(false)} aria-label="Zamknij zdjęcie">✕</button>
      <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} className="max-h-[92vh] max-w-[95vw] cursor-zoom-out object-contain" />
    </div>}
  </>;
}
