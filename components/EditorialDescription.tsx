import type { OfferEditorial } from "@/lib/offerEditorial";

function cleanText(value: string) {
  return value
    .replace(/([a-ząćęłńóśźż])([A-ZĄĆĘŁŃÓŚŹŻ])/g, "$1 $2")
    .replace(/([.!?;:])([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

export default function EditorialDescription({ copy }: { copy: OfferEditorial }) {
  return (
    <div data-offer-id={copy.offerId} data-editorial-version="2026-09-17" className="mx-auto mt-8 max-w-5xl space-y-6">
      {copy.sections.map(section => (
        <section key={section.id} id={`opis-${section.id}`} className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <h2 className="text-2xl font-black leading-snug">{cleanText(section.heading)}</h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-zinc-700">
            {section.paragraphs.map((paragraph, index) => <p key={`${section.id}-p-${index}`}>{cleanText(paragraph)}</p>)}
            {section.bullets?.length ? <ul className="list-disc space-y-2 pl-5">{section.bullets.map((item, index) => <li key={`${section.id}-b-${index}`}>{cleanText(item)}</li>)}</ul> : null}
          </div>
          {section.images?.length ? <div className={`mt-7 grid gap-5 ${section.images.length > 1 ? "md:grid-cols-2" : ""}`}>
            {section.images.map((image, index) => <figure key={`${image.url}-${index}`} data-placement={image.placement} className="overflow-hidden rounded-2xl bg-zinc-50 p-3">
              <img src={image.url} alt={cleanText(image.alt)} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="mx-auto h-auto max-h-[520px] w-full object-contain" />
            </figure>)}
          </div> : null}
        </section>
      ))}
    </div>
  );
}
