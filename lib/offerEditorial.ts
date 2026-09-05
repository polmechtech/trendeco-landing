import offer0 from "@/data/offer-editorial/18901353022.json";
import offer1 from "@/data/offer-editorial/18901357565.json";
import offer2 from "@/data/offer-editorial/18901362815.json";
import offer3 from "@/data/offer-editorial/18901367414.json";
import offer4 from "@/data/offer-editorial/18901369031.json";
import offer5 from "@/data/offer-editorial/18901370333.json";
import offer6 from "@/data/offer-editorial/18901376338.json";
import offer7 from "@/data/offer-editorial/18901381491.json";
import offer8 from "@/data/offer-editorial/18901386785.json";
import offer9 from "@/data/offer-editorial/18901393010.json";

export type EditorialSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  images?: { url: string; alt: string; placement: string }[];
};
export type OfferEditorial = {
  offerId: string;
  sections: EditorialSection[];
};
const descriptions: Record<string, OfferEditorial> = {
  [offer0.offerId]: offer0,
  [offer1.offerId]: offer1,
  [offer2.offerId]: offer2,
  [offer3.offerId]: offer3,
  [offer4.offerId]: offer4,
  [offer5.offerId]: offer5,
  [offer6.offerId]: offer6,
  [offer7.offerId]: offer7,
  [offer8.offerId]: offer8,
  [offer9.offerId]: offer9,
};
export function getOfferEditorial(offerId: string): OfferEditorial | undefined { return descriptions[offerId]; }
export function editorialText(copy: OfferEditorial) { return copy.sections.flatMap(section => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).join("\n\n"); }
