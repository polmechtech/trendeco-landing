export type SiteLocale = "en" | "cs" | "sk" | "hu" | "ro";

export const supportedLocales: SiteLocale[] = ["en", "cs", "sk", "hu", "ro"];

export const localeLabels: Record<SiteLocale | "pl", string> = {
  pl: "Polski",
  en: "English",
  cs: "Čeština",
  sk: "Slovenčina",
  hu: "Magyar",
  ro: "Română",
};

export const countryToLocale: Record<string, SiteLocale> = {
  CZ: "cs",
  SK: "sk",
  HU: "hu",
  RO: "ro",
};

export const texts: Record<SiteLocale, {
  intro: string;
  subintro: string;
  search: string;
  categories: Record<string, string>;
  available: string;
  unavailable: string;
  buyAllegro: string;
  noProducts: string;
  noResults: string;
  clear: string;
}> = {
  en: {
    intro: "Machines and tools for woodworking, construction and wood processing.",
    subintro: "Browse the current TrendEco range and open the selected offer on Allegro.",
    search: "Search products...",
    categories: { "Łuparki": "Log splitters", "Budownictwo": "Construction", "Meblarstwo": "Woodworking", "Akcesoria": "Accessories" },
    available: "Available",
    unavailable: "Temporarily unavailable",
    buyAllegro: "Buy on Allegro",
    noProducts: "Current Allegro offers could not be loaded.",
    noResults: "No products found",
    clear: "Clear search",
  },
  cs: {
    intro: "Stroje a nářadí pro truhlářství, stavebnictví a zpracování dřeva.",
    subintro: "Prohlédněte si aktuální nabídku TrendEco a otevřete vybranou nabídku na Allegro.cz.",
    search: "Hledat produkt...",
    categories: { "Łuparki": "Štípačky dřeva", "Budownictwo": "Stavebnictví", "Meblarstwo": "Truhlářství", "Akcesoria": "Příslušenství" },
    available: "Dostupné",
    unavailable: "Dočasně nedostupné",
    buyAllegro: "Koupit na Allegro.cz",
    noProducts: "Aktuální nabídky Allegro se nepodařilo načíst.",
    noResults: "Nebyly nalezeny žádné produkty",
    clear: "Vymazat hledání",
  },
  sk: {
    intro: "Stroje a náradie pre stolárstvo, stavebníctvo a spracovanie dreva.",
    subintro: "Pozrite si aktuálnu ponuku TrendEco a otvorte vybranú ponuku na Allegro.sk.",
    search: "Hľadať produkt...",
    categories: { "Łuparki": "Štiepačky dreva", "Budownictwo": "Stavebníctvo", "Meblarstwo": "Stolárstvo", "Akcesoria": "Príslušenstvo" },
    available: "Dostupné",
    unavailable: "Dočasne nedostupné",
    buyAllegro: "Kúpiť na Allegro.sk",
    noProducts: "Aktuálne ponuky Allegro sa nepodarilo načítať.",
    noResults: "Nenašli sa žiadne produkty",
    clear: "Vymazať vyhľadávanie",
  },
  hu: {
    intro: "Gépek és szerszámok faipari, építőipari és famegmunkálási feladatokhoz.",
    subintro: "Tekintse meg a TrendEco aktuális kínálatát, majd nyissa meg a kiválasztott ajánlatot az Allegro.hu oldalon.",
    search: "Termék keresése...",
    categories: { "Łuparki": "Rönkhasítók", "Budownictwo": "Építőipar", "Meblarstwo": "Faipar", "Akcesoria": "Tartozékok" },
    available: "Elérhető",
    unavailable: "Átmenetileg nem elérhető",
    buyAllegro: "Vásárlás az Allegro.hu-n",
    noProducts: "Az aktuális Allegro ajánlatok nem tölthetők be.",
    noResults: "Nincs találat",
    clear: "Keresés törlése",
  },
  ro: {
    intro: "Mașini și unelte pentru tâmplărie, construcții și prelucrarea lemnului.",
    subintro: "Consultați oferta actuală TrendEco și deschideți oferta selectată pe Allegro.",
    search: "Caută produs...",
    categories: { "Łuparki": "Despicătoare de lemn", "Budownictwo": "Construcții", "Meblarstwo": "Tâmplărie", "Akcesoria": "Accesorii" },
    available: "Disponibil",
    unavailable: "Indisponibil temporar",
    buyAllegro: "Cumpără pe Allegro",
    noProducts: "Ofertele Allegro actuale nu au putut fi încărcate.",
    noResults: "Nu au fost găsite produse",
    clear: "Șterge căutarea",
  },
};

export function allegroUrl(locale: SiteLocale, offerId: string): string {
  if (locale === "cs") return `https://allegro.cz/nabidka/${offerId}`;
  if (locale === "sk") return `https://allegro.sk/ponuka/${offerId}`;
  if (locale === "hu") return `https://allegro.hu/ajanlat/${offerId}`;
  return `https://allegro.pl/oferta/${offerId}`;
}

export function isSiteLocale(value: string): value is SiteLocale {
  return supportedLocales.includes(value as SiteLocale);
}
