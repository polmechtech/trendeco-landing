import Image from "next/image";
import type { OfferEditorial } from "@/lib/offerEditorial";

export default function EditorialDescription({ copy }: { copy: OfferEditorial }) {
  return (
    <div data-offer-id={copy.offerId} data-editorial-version="2026-09-05" className="mx-auto mt-8 max-w-5xl space-y-6">
      {copy.sections.map(section => (
        <section key={section.id} id={`opis-${section.id}`} className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <h2 className="text-2xl font-black leading-snug">{section.heading}</h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-zinc-700">
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets?.length ? <ul className="list-disc space-y-2 pl-5">{section.bullets.map(item => <li key={item}>{item}</li>)}</ul> : null}
          </div>
          {section.images?.length ? <div className={`mt-7 grid gap-5 ${section.images.length > 1 ? "md:grid-cols-2" : ""}`}>
            {section.images.map(image => <figure key={image.url} data-placement={image.placement} className="rounded-2xl bg-zinc-50 p-3">
              <Image src={image.url} alt={image.alt} width={1000} height={750} unoptimized className="h-auto max-h-[520px] w-full object-contain" sizes="(max-width: 768px) 100vw, 900px" />
            </figure>)}
          </div> : null}
        </section>
      ))}
    </div>
  );
}
