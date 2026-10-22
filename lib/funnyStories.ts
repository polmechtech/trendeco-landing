export type FunnyStory={slug:string;hero:string;character:string;product:string;href:string;story:string};
export const funnyStories:FunnyStory[]=[
  {
    "slug": "bartek-i-debowa-niespodzianka",
    "hero": "Bartek i dębowa niespodzianka",
    "character": "Bartek ze Śląska",
    "product": "Łuparki do drewna",
    "href": "/kategoria/luparka-przekladniowa",
    "story": "Bartek ze śląskiej wsi dostał zlecenie na drewno dla pana Zbyszka. „Tylko proste polana” — zapewniał klient. Na podwórzu czekał jednak dąb tak sękaty, że wyglądał jak rodzinne drzewo genealogiczne. Sąsiad Franek przyniósł siekierę i dobrą radę: „Trza mocniej!”. Bartek uruchomił swoją łuparkę przekładniową POLMECH.TECH 400 V, chwycił drewno specjalnymi kleszczami i zabrał się do pracy zgodnie z instrukcją. Po chwili polana leżały równo ułożone. Franek schował siekierę. „No i co, technika?” — zapytał. „Nie, Franek. Polska myśl praktyczna: mniej gadania, więcej drewna”. Pan Zbyszek dostał opał na czas, a Franek awansował na kierownika od herbaty."
  },
  {
    "slug": "leszek-i-szafka-ktora-miala-nie-pasowac",
    "hero": "Leszek i szafka, która miała nie pasować",
    "character": "Leszek z Lubelszczyzny",
    "product": "Piły formatowe",
    "href": "/kategoria/pila-formatowa",
    "story": "Leszek z Lubelszczyzny montował kuchnię u pani Krysi. Projekt był idealny — przynajmniej do chwili, gdy okazało się, że ściana biegnie bardziej po swojemu niż według poziomicy. „Dom ma charakter” — oznajmiła gospodyni. Leszek zmierzył wszystko jeszcze raz, przygotował formatki na pile formatowej z podcinakiem i dopasował zabudowę z cierpliwością godną szachisty. Gdy zawiesił ostatni front, pani Krysia otworzyła wszystkie szafki po trzy razy. „Panie Leszku, jak z katalogu!”. „Lepiej — z Lubelskiego” — odparł. Mąż gospodyni spytał tylko, czy da się tak samo wyrównać rachunki. Leszek powiedział, że do tego jeszcze nie wymyślono prowadnicy."
  }
];
export const getFunnyStory=(slug:string)=>funnyStories.find(x=>x.slug===slug);
