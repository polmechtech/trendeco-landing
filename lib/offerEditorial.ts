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

import offer10 from "@/data/offer-editorial/18901345311.json";
import offer11 from "@/data/offer-editorial/18891625103.json";
import offer12 from "@/data/offer-editorial/18891622310.json";
import offer13 from "@/data/offer-editorial/18891618377.json";
import offer14 from "@/data/offer-editorial/18891612769.json";
import offer15 from "@/data/offer-editorial/18891603535.json";
import offer16 from "@/data/offer-editorial/18891593931.json";
import offer17 from "@/data/offer-editorial/18878600668.json";
import offer18 from "@/data/offer-editorial/18793690873.json";
import offer19 from "@/data/offer-editorial/18775655922.json";

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
  [offer10.offerId]: offer10,
  [offer11.offerId]: offer11,
  [offer12.offerId]: offer12,
  [offer13.offerId]: offer13,
  [offer14.offerId]: offer14,
  [offer15.offerId]: offer15,
  [offer16.offerId]: offer16,
  [offer17.offerId]: offer17,
  [offer18.offerId]: offer18,
  [offer19.offerId]: offer19,
};
export function getOfferEditorial(offerId: string): OfferEditorial | undefined { return descriptions[offerId]; }
export function editorialText(copy: OfferEditorial) { return copy.sections.flatMap(section => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).join("\n\n"); }
