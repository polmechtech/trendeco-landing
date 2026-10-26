export type FunnyStory={slug:string;hero:string;character:string;product:string;href:string;story:string};
export const funnyStories:FunnyStory[]=[
  {
    "slug": "bartek-i-centymetr-dla-komisji-2026-10-26",
    "hero": "Bartek i centymetr dla komisji",
    "character": "Bartek ze Śląska",
    "product": "Łuparki do drewna",
    "href": "/kategoria/luparka-przekladniowa",
    "story": "Bartek ze Śląska szykował drewno opałowe na jesienny festyn w remizie. Organizator poprosił: „Niech polana będą jednakowe, bo komisja lubi porządek”. Bartek pociął kłody na odpowiednią długość, a potem spokojnie przygotował szczapy przy łuparce do drewna. Gdy stos był gotowy, przyszedł sołtys z miarką i zmierzył pierwsze polano. „O centymetr za krótkie!” — orzekł. Bartek pokazał mu kartkę: „Drewno do pieca, nie do defilady”. Sołtys chwilę pomyślał, po czym dopisał: „Komisja uznaje centymetr za oszczędność miejsca”. Festyn się udał, w remizie było ciepło, a protokół po raz pierwszy zmieścił się na jednej stronie."
  },
  {
    "slug": "leszek-i-polka-na-fantastyke-2026-10-26",
    "hero": "Leszek i półka na fantastykę",
    "character": "Leszek z Lubelskiego",
    "product": "Piły formatowe",
    "href": "/kategoria/pila-formatowa",
    "story": "Leszek z Lubelskiego dostał zlecenie na regał do domowej biblioteki. Pani Maria zażyczyła sobie osobnej półki na książki, których nikt nie czyta. Leszek przygotował formatki meblowe na pile formatowej, dopasował obrzeża i podczas montażu mebli spytał, czy półka ma być mocniejsza. „Najmocniejsza” — odpowiedziała. Następnego dnia zobaczył na niej instrukcje obsługi pralki, piekarnika i pilota. „A po co aż taka wytrzymałość?” — zdziwił się. „Mąż obiecał, że kiedyś wszystkie przeczyta”. Leszek tylko skinął głową i dołożył dyskretny wspornik. Regał stoi prosto, pani Maria jest zadowolona, a domowa literatura fantastyczna ma wreszcie własny dział."
  },
  {
    "slug": "bartek-i-debowa-niespodzianka",
    "hero": "Bartek i dębowa niespodzianka",
    "character": "Bartek ze Śląska",
    "product": "Łuparki do drewna",
    "href": "/kategoria/luparka-przekladniowa",
    "story": "Bartek ze śląskiej wsi dostał zlecenie na drewno dla pana Zbyszka. „Tylko proste polana” — zapewniał klient. Na podwórzu czekał jednak dąb tak sękaty, że wyglądał jak rodzinne drzewo genealogiczne. Sąsiad Franek przyniósł siekierę i dobrą radę: „Trza mocniej!”. Bartek uruchomił łuparkę do drewna z przekładnią, chwycił polano specjalnymi kleszczami i zabrał się do pracy zgodnie z instrukcją. Po chwili polana leżały równo ułożone. Franek schował siekierę. „No i co, technika?” — zapytał. „Nie, Franek. Polska myśl praktyczna: mniej gadania, więcej drewna”. Pan Zbyszek dostał opał na czas, a Franek awansował na kierownika od herbaty."
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
