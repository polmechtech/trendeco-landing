export type SiteLocale = "cs" | "sk" | "hu";

export const supportedLocales: SiteLocale[] = ["cs", "sk", "hu"];

export const localeLabels: Record<SiteLocale | "pl", string> = {
  pl: "Polski",
  cs: "Čeština",
  sk: "Slovenčina",
  hu: "Magyar",
};

export const countryToLocale: Record<string, SiteLocale> = {
  CZ: "cs",
  SK: "sk",
  HU: "hu",
};

export const texts: Record<SiteLocale, {
  intro: string;
  subintro: string;
  search: string;
  categories: Record<string, string>;
  available: string;
  unavailable: string;
  buyCourier: string;
  buyAllegro: string;
  whatsappOrder: (productName: string, offerId: string) => string;
  noProducts: string;
  noResults: string;
  clear: string;
}> = {
  cs: {
    intro: "Stroje a nářadí pro truhlářství, stavebnictví a zpracování dřeva.",
    subintro: "Prohlédněte si aktuální nabídku TrendEco a otevřete vybranou nabídku na Allegro.cz.",
    search: "Hledat produkt...",
    categories: { "Łuparki": "Štípačky dřeva", "Budownictwo": "Stavebnictví", "Meblarstwo": "Truhlářství", "Akcesoria": "Příslušenství" },
    available: "Dostupné",
    unavailable: "Dočasně nedostupné",
    buyCourier: "Objednat s platbou kurýrovi",
    buyAllegro: "Koupit na Allegro.cz",
    whatsappOrder: (productName, offerId) => `Dobrý den, chci objednat produkt „${productName}” (nabídka ${offerId}) s platbou kurýrovi při převzetí. Prosím o potvrzení dostupnosti, ceny a dopravy.`,
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
    buyCourier: "Objednať s platbou kuriérovi",
    buyAllegro: "Kúpiť na Allegro.sk",
    whatsappOrder: (productName, offerId) => `Dobrý deň, chcem objednať produkt „${productName}” (ponuka ${offerId}) s platbou kuriérovi pri prevzatí. Prosím o potvrdenie dostupnosti, ceny a dopravy.`,
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
    buyCourier: "Rendelés fizetéssel a futárnál",
    buyAllegro: "Vásárlás az Allegro.hu-n",
    whatsappOrder: (productName, offerId) => `Jó napot! Szeretném megrendelni a(z) „${productName}” terméket (ajánlat: ${offerId}) fizetéssel a futárnál átvételkor. Kérem, erősítsék meg az elérhetőséget, az árat és a szállítást.`,
    noProducts: "Az aktuális Allegro ajánlatok nem tölthetők be.",
    noResults: "Nincs találat",
    clear: "Keresés törlése",
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
