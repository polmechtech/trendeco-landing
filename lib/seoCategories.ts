import type { AllegroProduct } from "@/lib/allegro";

export type SeoCategory = {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  terms: string[];
};

export const seoCategories: SeoCategory[] = [
  {
    slug: "pila-formatowa",
    keyword: "piła formatowa",
    title: "Piła formatowa — stołowe piły formatowe TrendEco",
    description: "Piły formatowe TrendEco do płyt, drewna i prac stolarskich. Sprawdź aktualne modele, ceny, dostępność i zakup przez TrendEco, Allegro lub ERLI.",
    heading: "Piła formatowa — piły formatowe do warsztatu i stolarni",
    intro: "Piła formatowa ułatwia dokładne cięcie płyt meblowych, drewna i materiałów drewnopochodnych. Poniżej znajdują się aktualnie dostępne piły formatowe i powiązane maszyny TrendEco z bieżącymi cenami i dostępnością.",
    terms: ["piła formatowa", "pila formatowa", "formatowa"],
  },
  {
    slug: "pila-stolowa",
    keyword: "piła stołowa",
    title: "Piła stołowa — piły stołowe do drewna TrendEco",
    description: "Piły stołowe TrendEco do warsztatu, stolarni i obróbki drewna. Aktualne modele, ceny i dostępność. Kup bezpośrednio, na Allegro lub ERLI.",
    heading: "Piła stołowa — piły stołowe do drewna i płyt",
    intro: "Piła stołowa jest podstawową maszyną do powtarzalnego cięcia drewna i płyt. Zobacz dostępne piły stołowe TrendEco, ich aktualne ceny, stan magazynowy i warianty zakupu.",
    terms: ["piła stołowa", "pila stolowa", "stołowa", "stolowa"],
  },
  {
    slug: "pila-do-betonu",
    keyword: "piła do betonu",
    title: "Piła do betonu — piły pierścieniowe TrendEco",
    description: "Piły do betonu i żelbetu TrendEco, w tym piły pierścieniowe do głębokiego cięcia. Sprawdź ceny, dostępność, prowadnice i akcesoria.",
    heading: "Piła do betonu i żelbetu — piły pierścieniowe",
    intro: "Piła do betonu przeznaczona jest do cięcia betonu, żelbetu, kamienia i materiałów budowlanych. TrendEco oferuje piły pierścieniowe, prowadnice oraz osprzęt do profesjonalnego cięcia na mokro.",
    terms: ["piła do betonu", "pila do betonu", "piła pierścieniowa", "pila pierscieniowa", "beton", "żelbet", "zelbet", "ring saw"],
  },
  {
    slug: "pila-pierscieniowa",
    keyword: "piła pierścieniowa",
    title: "Piła pierścieniowa do betonu i żelbetu — TrendEco",
    description: "Piły pierścieniowe TrendEco do głębokiego cięcia betonu, żelbetu i kamienia. Sprawdź aktualne modele, ceny, dostępność, prowadnice, tarcze i części.",
    heading: "Piła pierścieniowa do betonu, żelbetu i kamienia",
    intro: "Piła pierścieniowa umożliwia głębokie cięcie betonu, żelbetu, kamienia i innych materiałów budowlanych. Zobacz aktualnie dostępne piły pierścieniowe TrendEco, prowadnice, tarcze oraz powiązany osprzęt do cięcia na mokro.",
    terms: ["piła pierścieniowa", "pila pierscieniowa", "pierścieniowa", "pierscieniowa", "ring saw"],
  },
  {
    slug: "przecinarka-do-plytek",
    keyword: "przecinarka do płytek",
    title: "Przecinarka do płytek — przecinarki TrendEco",
    description: "Przecinarki do płytek, gresu i materiałów budowlanych TrendEco. Zobacz aktualne modele, ceny i dostępność oraz kup online.",
    heading: "Przecinarka do płytek i gresu",
    intro: "Przecinarka do płytek pozwala wykonywać precyzyjne cięcia płytek ceramicznych, gresu i podobnych materiałów. Poniżej prezentujemy aktualnie dostępne przecinarki TrendEco i powiązane akcesoria.",
    terms: ["przecinarka do płytek", "przecinarka do plytek", "przecinarka", "płytki", "plytki", "gres"],
  },
  {
    slug: "okleiniarka",
    keyword: "okleiniarka",
    title: "Okleiniarka do płyt i mebli — okleiniarki TrendEco",
    description: "Okleiniarki TrendEco do obrzeży meblowych i płyt. Sprawdź okleiniarki ręczne i automatyczne, aktualne ceny, dostępność oraz wyposażenie.",
    heading: "Okleiniarka do płyt meblowych i obrzeży",
    intro: "Okleiniarka służy do szybkiego i dokładnego nakładania obrzeży na płyty meblowe. Zobacz aktualnie dostępne okleiniarki TrendEco do warsztatu, stolarni i produkcji mebli, w tym modele z automatycznym podawaniem i obcinaniem taśmy.",
    terms: ["okleiniarka", "okleiniarki", "oklejarka", "oklejanie obrzeży", "obrzeża meblowe"],
  },
];

export function getSeoCategory(slug: string) {
  return seoCategories.find((category) => category.slug === slug) ?? null;
}

export function matchesSeoCategory(product: AllegroProduct, category: SeoCategory) {
  const name = product.name.toLocaleLowerCase("pl-PL");
  return category.terms.some((term) => name.includes(term.toLocaleLowerCase("pl-PL")));
}
