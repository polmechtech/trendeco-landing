import offer0 from "@/data/offer-editorial/18550928835.json";
import offer1 from "@/data/offer-editorial/18550930467.json";
import offer2 from "@/data/offer-editorial/18550932673.json";
import offer3 from "@/data/offer-editorial/18550934081.json";
import offer4 from "@/data/offer-editorial/18550950641.json";
import offer5 from "@/data/offer-editorial/18550953191.json";
import offer6 from "@/data/offer-editorial/18550959962.json";
import offer7 from "@/data/offer-editorial/18550962217.json";
import offer8 from "@/data/offer-editorial/18550963921.json";
import offer9 from "@/data/offer-editorial/18550965218.json";
import offer10 from "@/data/offer-editorial/18550976488.json";
import offer11 from "@/data/offer-editorial/18550986067.json";
import offer12 from "@/data/offer-editorial/18550988265.json";
import offer13 from "@/data/offer-editorial/18690183650.json";
import offer14 from "@/data/offer-editorial/18690915823.json";
import offer15 from "@/data/offer-editorial/18690919967.json";
import offer16 from "@/data/offer-editorial/18690927460.json";
import offer17 from "@/data/offer-editorial/18690933709.json";
import offer18 from "@/data/offer-editorial/18690937061.json";
import offer19 from "@/data/offer-editorial/18690940209.json";
import offer20 from "@/data/offer-editorial/18690943268.json";
import offer21 from "@/data/offer-editorial/18775311531.json";
import offer22 from "@/data/offer-editorial/18775316962.json";
import offer23 from "@/data/offer-editorial/18775320803.json";
import offer24 from "@/data/offer-editorial/18775322985.json";
import offer25 from "@/data/offer-editorial/18775325631.json";
import offer26 from "@/data/offer-editorial/18775327435.json";
import offer27 from "@/data/offer-editorial/18775329625.json";
import offer28 from "@/data/offer-editorial/18775332230.json";
import offer29 from "@/data/offer-editorial/18775336284.json";
import offer30 from "@/data/offer-editorial/18775338435.json";
import offer31 from "@/data/offer-editorial/18775342926.json";
import offer32 from "@/data/offer-editorial/18775345984.json";
import offer33 from "@/data/offer-editorial/18775348117.json";
import offer34 from "@/data/offer-editorial/18775349997.json";
import offer35 from "@/data/offer-editorial/18775352139.json";
import offer36 from "@/data/offer-editorial/18775655922.json";
import offer37 from "@/data/offer-editorial/18793690873.json";
import offer38 from "@/data/offer-editorial/18878600668.json";
import offer39 from "@/data/offer-editorial/18891593931.json";
import offer40 from "@/data/offer-editorial/18891603535.json";
import offer41 from "@/data/offer-editorial/18891612769.json";
import offer42 from "@/data/offer-editorial/18891618377.json";
import offer43 from "@/data/offer-editorial/18891622310.json";
import offer44 from "@/data/offer-editorial/18891625103.json";
import offer45 from "@/data/offer-editorial/18901345311.json";
import offer46 from "@/data/offer-editorial/18901353022.json";
import offer47 from "@/data/offer-editorial/18901357565.json";
import offer48 from "@/data/offer-editorial/18901362815.json";
import offer49 from "@/data/offer-editorial/18901367414.json";
import offer50 from "@/data/offer-editorial/18901369031.json";
import offer51 from "@/data/offer-editorial/18901370333.json";
import offer52 from "@/data/offer-editorial/18901376338.json";
import offer53 from "@/data/offer-editorial/18901381491.json";
import offer54 from "@/data/offer-editorial/18901386785.json";
import offer55 from "@/data/offer-editorial/18901393010.json";
import offer56 from "@/data/offer-editorial/18902521031.json";

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
  [offer20.offerId]: offer20,
  [offer21.offerId]: offer21,
  [offer22.offerId]: offer22,
  [offer23.offerId]: offer23,
  [offer24.offerId]: offer24,
  [offer25.offerId]: offer25,
  [offer26.offerId]: offer26,
  [offer27.offerId]: offer27,
  [offer28.offerId]: offer28,
  [offer29.offerId]: offer29,
  [offer30.offerId]: offer30,
  [offer31.offerId]: offer31,
  [offer32.offerId]: offer32,
  [offer33.offerId]: offer33,
  [offer34.offerId]: offer34,
  [offer35.offerId]: offer35,
  [offer36.offerId]: offer36,
  [offer37.offerId]: offer37,
  [offer38.offerId]: offer38,
  [offer39.offerId]: offer39,
  [offer40.offerId]: offer40,
  [offer41.offerId]: offer41,
  [offer42.offerId]: offer42,
  [offer43.offerId]: offer43,
  [offer44.offerId]: offer44,
  [offer45.offerId]: offer45,
  [offer46.offerId]: offer46,
  [offer47.offerId]: offer47,
  [offer48.offerId]: offer48,
  [offer49.offerId]: offer49,
  [offer50.offerId]: offer50,
  [offer51.offerId]: offer51,
  [offer52.offerId]: offer52,
  [offer53.offerId]: offer53,
  [offer54.offerId]: offer54,
  [offer55.offerId]: offer55,
  [offer56.offerId]: offer56,
};
export function getOfferEditorial(offerId: string): OfferEditorial | undefined { return descriptions[offerId]; }
export function editorialText(copy: OfferEditorial) { return copy.sections.flatMap(section => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).join("\n\n"); }
