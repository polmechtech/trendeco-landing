export type SeoGuide = { published?: string; slug: string; title: string; description: string; heading: string; sections: { heading: string; text: string }[]; links: { label: string; href: string }[] };

export const seoGuides: SeoGuide[] = [
  { slug: "jak-wybrac-pile-formatowa", title: "Jak wybrać piłę formatową do warsztatu?", description: "Podcinak, stół, zasilanie, zakres cięcia i serwis — kryteria wyboru piły formatowej.", heading: "Jak wybrać piłę formatową do warsztatu i produkcji mebli", sections: [
    { heading: "Materiał i format", text: "Najpierw określ największy format płyty, który obrabiasz. Liczy się realny przesuw stołu, zakres prowadnicy, głębokość cięcia oraz miejsce potrzebne do bezpiecznego podawania materiału. Do płyt laminowanych i lakierowanych potrzebny jest stabilny stół i prawidłowo ustawiony podcinak." },
    { heading: "Napęd i dokładność", text: "W małym warsztacie praktyczne może być zasilanie 230 V, natomiast przy długiej pracy pod obciążeniem warto rozważyć 400 V. Dokładność zależy od sztywności konstrukcji, ustawienia prowadnic i możliwości ich kalibracji — nie tylko od średnicy tarczy." },
    { heading: "Serwis przed ceną", text: "Dobra oferta powinna jasno podawać wymiary, wyposażenie, instrukcję, gwarancję i dostępność części. Na kartach TrendEco publikujemy aktualne ceny, stany, opisy oraz informacje producenta i bezpieczeństwa GPSR." }
  ], links: [{ label: "Piły formatowe", href: "/kategoria/pila-formatowa" }, { label: "Piły stołowe", href: "/kategoria/pila-stolowa" }] },
  { slug: "pila-pierscieniowa-do-betonu", title: "Piła pierścieniowa do betonu — jak dobrać?", description: "Głębokość cięcia, chłodzenie, prowadnica i części do piły pierścieniowej.", heading: "Piła pierścieniowa do betonu i żelbetu — poradnik wyboru", sections: [
    { heading: "Głębokość i materiał", text: "Piła pierścieniowa służy do głębokiego cięcia betonu, żelbetu, cegły i kamienia. Maksymalną głębokość porównaj z grubością elementów wykonywanych najczęściej. Do żelbetu potrzebny jest pierścień przeznaczony do kruszywa i zbrojenia." },
    { heading: "Woda i prędkość", text: "Stałe chłodzenie wodą odbiera ciepło, wypłukuje urobek i ogranicza pylenie. Praca bez właściwego przepływu szybko zużywa pierścień, prowadnicę i napęd. Równomierny posuw jest bezpieczniejszy niż wymuszanie cięcia naciskiem." },
    { heading: "Części i bezpieczeństwo", text: "Przed zakupem sprawdź dostępność pierścieni, prowadnic, rolek, łożysk i zębatek. Operator powinien stosować ochronę wzroku, słuchu i dróg oddechowych oraz zabezpieczyć strefę cięcia." }
  ], links: [{ label: "Piły pierścieniowe", href: "/kategoria/pila-pierscieniowa" }, { label: "Piły do betonu", href: "/kategoria/pila-do-betonu" }] },
  { slug: "luparka-przekladniowa-230v-czy-400v", title: "Łuparka przekładniowa 230 V czy 400 V?", description: "Porównanie zasilania 230 V i 400 V w łuparce przekładniowej.", heading: "Łuparka przekładniowa 230 V czy 400 V — co wybrać", sections: [
    { heading: "Kiedy 230 V", text: "Wersja 230 V jest praktyczna tam, gdzie nie ma instalacji trójfazowej. Trzeba sprawdzić zabezpieczenie obwodu, przekrój przewodu, prąd rozruchowy i zalecenia producenta. Przy seryjnej pracy silnik jednofazowy może wymagać przerw." },
    { heading: "Zalety 400 V", text: "Zasilanie 400 V pasuje do częstej pracy w gospodarstwie lub firmie. Silnik trójfazowy zwykle stabilniej pracuje pod obciążeniem, jeśli instalacja jest właściwie wykonana. Samo napięcie nie zastępuje oceny przełożenia, ramy, osłon i sterowania." },
    { heading: "Dobór do polan", text: "Zmierz typową średnicę i długość polan. Dla drewna sękatego ważna jest możliwość bezpiecznego wycofania mechanizmu, sterowanie oburęczne i czytelna procedura postępowania przy zakleszczeniu." }
  ], links: [{ label: "Łuparki przekładniowe", href: "/kategoria/luparka-przekladniowa" }, { label: "POLMECH.TECH", href: "https://polmech.tech" }] },
  { slug: "okleiniarka-do-plyt-meblowych", title: "Okleiniarka do płyt meblowych — poradnik", description: "Obrzeże, klej, temperatura, posuw, frezowanie i serwis okleiniarki.", heading: "Okleiniarka do płyt meblowych — jak dopasować maszynę", sections: [
    { heading: "Obrzeże i element", text: "Określ zakres grubości obrzeża i płyty. ABS, PVC, melamina oraz fornir wymagają właściwej temperatury, docisku i prowadzenia. Do elementów prostych wystarczy inny układ niż do łuków i małych promieni." },
    { heading: "Klej i posuw", text: "Zbyt niska temperatura pogarsza przyczepność, a zbyt wysoka może uszkodzić obrzeże. Stabilny posuw i równy docisk rolek są ważniejsze niż sama maksymalna prędkość. Przy pracy seryjnej liczy się też łatwe czyszczenie układu klejowego." },
    { heading: "Warunki pracy", text: "Zapewnij odciąg, sprężone powietrze zgodne z instrukcją i przestrzeń na podawanie płyt. Przed zakupem sprawdź zasilanie, części eksploatacyjne, instrukcję oraz serwis w Polsce." }
  ], links: [{ label: "Okleiniarki", href: "/kategoria/okleiniarka" }, { label: "Kontakt", href: "/o-nas" }] },
  { slug: "frez-i-wal-spiralny-do-drewna", title: "Frez i wał spiralny do drewna", description: "Różnice między frezem, głowicą i wałem spiralnym oraz zasady bezpiecznego doboru.", heading: "Frez i wał spiralny do drewna — czym różnią się zastosowania", sections: [
    { heading: "Najpierw wymiary", text: "Frez trzpieniowy, nasadzany i głowica na płytki wymienne są dobierane do konkretnej operacji i maszyny. Sprawdź średnicę, długość roboczą, trzpień lub otwór, kierunek obrotów i maksymalne obroty." },
    { heading: "Wał spiralny", text: "Wał spiralny do strugarki lub grubościówki ocenia się według wymiarów, liczby i układu płytek oraz zgodności z łożyskami i napędem. Czyste gniazda i równomierne dokręcenie płytek ograniczają bicie." },
    { heading: "Bezpieczny montaż", text: "Przed pracą odłącz maszynę od zasilania. Nie używaj narzędzia po upadku, z pęknięciem, wyszczerbioną płytką albo bez wymaganych osłon. Po montażu wykonaj próbę bez materiału." }
  ], links: [{ label: "Narzędzia WIDIA.TECH", href: "https://widia.tech" }, { label: "Oferta TrendEco", href: "/" }] },
  {
  "slug": "mobilna-formatowka-wj100-czy-wj108",
    "published": "2026-11-03",
  "title": "WJ100 czy WJ108 — który stół formatowy wybrać?",
  "description": "Porównanie mobilnych stołów WJ100 i WJ108 pod kątem miejsca pracy, transportu i wyposażenia.",
  "heading": "WJ100 czy WJ108? Dobór mobilnego stołu formatowego",
  "sections": [
    {
      "heading": "Wielkość stanowiska jest ważniejsza od nazwy",
      "text": "WJ100 ma blat 1200 × 980 mm, a po rozłożeniu osiąga maksymalnie 2150 × 1480 mm; masa samego stołu to około 54 kg. WJ108 jest mniejszy: blat 980 × 800 mm, dodatkowe podparcie 450 mm i masa samego stołu około 14 kg. Do częstego przenoszenia po schodach i montażu w ciasnym mieszkaniu mniejszy stół może być praktyczniejszy. Przy większych formatkach szersze podparcie WJ100 ogranicza konieczność organizowania dodatkowych podpór."
    },
    {
      "heading": "Stół bez piły a gotowy zestaw",
      "text": "Oznaczenia WJ100 i WJ108 występują zarówno przy samych stołach, jak i przy zestawach z zespołem tnącym. Przed porównaniem cen sprawdź listę elementów: piła główna, podcinak, odciąg, frezarka i okleiniarka nie zawsze są częścią kompletu. W ofertach samych stołów otwór montażowy ma 500 × 300 mm, ale zgodność mocowania konkretnego modułu trzeba potwierdzić osobno."
    },
    {
      "heading": "Scenariusz decyzji",
      "text": "Jeżeli obrabiasz głównie niewielkie elementy na montażu, zacznij od WJ108 i zaplanuj dodatkowe stabilne podparcie długich płyt. Jeżeli najczęściej rozkrawasz szersze płyty meblowe i możesz przeznaczyć więcej miejsca, sprawdź WJ100. W obu przypadkach zostaw bezpieczną przestrzeń wejścia i wyjścia materiału oraz przetestuj ograniczniki na próbnych formatkach."
    }
  ],
  "links": [
    {
      "label": "Piły i stoły formatowe",
      "href": "/kategoria/pila-formatowa"
    },
    {
      "label": "Katalog TrendEco",
      "href": "/"
    }
  ]
},
  {
  "slug": "podcinak-i-tarcza-glowna-do-laminatu",
    "published": "2026-11-03",
  "title": "Podcinak i tarcza do laminatu — jak dobrać zestaw?",
  "description": "Wymiary, rzaz i ustawienie podcinaka 110 mm z tarczą 200 mm lub 230 mm.",
  "heading": "Podcinak 110 mm i tarcza główna — dobór do płyt laminowanych",
  "sections": [
    {
      "heading": "Dwa narzędzia, dwa zadania",
      "text": "Podcinak wykonuje płytkie nacięcie warstwy laminatu, a tarcza główna rozcina płytę na pełną głębokość. W opisanych ofertach podcinak ma średnicę 110 mm, otwór 20 mm i 24 zęby trapezowe. Tarcza główna 200 mm ma otwór 25,4 mm, 60 zębów i rzaz 2,6 mm. Nie można zamieniać ich miejscami ani dobierać tylko na podstawie średnicy zewnętrznej."
    },
    {
      "heading": "Dlaczego szerokość rzazu decyduje o krawędzi",
      "text": "Nacięcie podcinaka trzeba wyregulować do szerokości rzazu tarczy głównej i osi cięcia. Zbyt wąskie nacięcie pozostawi wyrwania laminatu, a zbyt szerokie stworzy widoczną krawędź. Ustawienie wykonuj na odpadzie tej samej płyty, przy wyłączonym napędzie podczas regulacji. Kontroluj także bicie tarcz, czystość kołnierzy i kierunek obrotów."
    },
    {
      "heading": "Kiedy komplet, a kiedy pojedyncza tarcza",
      "text": "Komplet 110/200 mm ma sens przy wymianie obu zużytych elementów. Oferta z dodatkowymi tarczami 200 mm 60T i 230 mm 80T daje wybór, ale średnica 230 mm musi być dopuszczona przez konkretną maszynę, osłony i zakres obrotów. Nie zakładaj zgodności z każdą formatówką tylko dlatego, że pasuje otwór mocujący."
    }
  ],
  "links": [
    {
      "label": "Akcesoria do pił",
      "href": "/kategoria/pila-stolowa"
    },
    {
      "label": "Oferta TrendEco",
      "href": "/"
    }
  ]
},
  {
  "slug": "zestaw-pila-frezarka-okleiniarka-czy-osobne-maszyny",
    "published": "2026-11-03",
  "title": "Piła, frezarka i okleiniarka — razem czy osobno?",
  "description": "Jak wybrać modułowy zestaw do mebli i ocenić straty czasu przy zmianie operacji.",
  "heading": "Jedno stanowisko czy osobne maszyny do produkcji mebli?",
  "sections": [
    {
      "heading": "Ile razy dziennie zmieniasz operację",
      "text": "Połączenie piły z podcinakiem, frezarki i okleiniarki oszczędza miejsce, ale nie oznacza jednoczesnej pracy wszystkich modułów. Jeżeli robisz jedną kuchnię od początku do końca, zmiany konfiguracji mogą być akceptowalne. Przy naprzemiennym cięciu, frezowaniu i oklejaniu wielu zleceń osobne stanowiska skracają przestoje i pomagają utrzymać powtarzalne ustawienia."
    },
    {
      "heading": "Sprawdź dokładną zawartość wariantu",
      "text": "W ofertach występują zestawy tylko z piłą i podcinakiem, z dodatkową frezarką oraz konfiguracje z okleiniarką Mini. Podobne nazwy Standard, Lux, Plus i Max nie zastępują spisu wyposażenia. W jednej z ofert status okleiniarki Mini jest opisany niejednoznacznie, dlatego jej obecność trzeba potwierdzić przed zakupem. Osobno sprawdź mocowanie, tuleje frezarki i sposób podłączenia odciągu."
    },
    {
      "heading": "Policz koszt stanowiska, nie samej skrzynki",
      "text": "Do porównania dolicz transport, podparcia płyt, odciąg, sprężarkę wymaganą przez wybraną okleiniarkę, narzędzia i przestrzeń serwisową. Oceniaj też, czy po wyjęciu modułu zachowasz ustawienie prowadnic. Dla warsztatu o ograniczonej powierzchni wielofunkcyjność jest korzyścią; dla produkcji ciągłej najczęściej ważniejszy będzie przepływ materiału."
    }
  ],
  "links": [
    {
      "label": "Pilarki formatowe",
      "href": "/kategoria/pila-formatowa"
    },
    {
      "label": "Okleiniarki",
      "href": "/kategoria/okleiniarka"
    }
  ]
},
  {
  "slug": "okleiniarka-mini-medium-optimus-wf700",
    "published": "2026-11-03",
  "title": "Mini, Medium, Optimus czy WF-700 — dobór okleiniarki",
  "description": "Różnice w sposobie pracy i wyposażeniu kompaktowych okleiniarek TrendEco.",
  "heading": "Jak dobrać okleiniarkę: Mini, Medium, Optimus i WF-700",
  "sections": [
    {
      "heading": "Najpierw ustal, co ma robić maszyna",
      "text": "Modele Mini, Medium i Optimus służą przede wszystkim do nakładania obrzeża, a różnią się ergonomią stanowiska, prowadzeniem detalu i konfiguracją stołu. WF-700 łączy także obcinanie, frezowanie i polerowanie obrzeża, więc odpowiada na inne pytanie: czy chcesz zamknąć kilka etapów w jednym urządzeniu. Sama większa liczba funkcji nie gwarantuje lepszego wyniku na bardzo małych detalach."
    },
    {
      "heading": "Porównuj faktyczne zakresy",
      "text": "W opisach Medium i Optimus pojawiają się obrzeża 0,5–2 mm, grubość elementu 7–60 mm, zbiornik 1000 ml i regulowany posuw do 8 m/min. WF-700 ma deklarowany zakres obrzeża 0,3–3,0 mm i posuw do 6 m/min. Te wartości dotyczą określonych modeli, nie całej rodziny. Przed zakupem sprawdź wymagane zasilanie, sprężone powietrze, długość rozgrzewania oraz materiały obrzeża."
    },
    {
      "heading": "Dobór do profilu zamówień",
      "text": "Do sporadycznego oklejania prostych i zakrzywionych elementów wystarczy często prostsze stanowisko z osobnym wykańczaniem. Jeżeli wykonujesz powtarzalne szafy i kuchnie, policz czas ręcznego obcinania i frezowania po klejeniu — to może uzasadnić WF-700. Przy krótkich, wąskich detalach sprawdź minimalne podparcie i sposób chwytania elementu, zanim skupisz się na maksymalnym posuwie."
    }
  ],
  "links": [
    {
      "label": "Okleiniarki TrendEco",
      "href": "/kategoria/okleiniarka"
    },
    {
      "label": "Poradnik o oklejaniu",
      "href": "/poradnik/okleiniarka-do-plyt-meblowych"
    }
  ]
},
  {
  "slug": "przygotowanie-krawedzi-przed-oklejaniem",
    "published": "2026-11-03",
  "title": "Frezowanie wstępne i wykańczanie obrzeża PVC",
  "description": "Kiedy potrzebny jest moduł frezowania krawędzi, a kiedy wystarczy ręczny trymer R2.",
  "heading": "Od surowej krawędzi płyty do gotowego obrzeża PVC",
  "sections": [
    {
      "heading": "Po cięciu oceń krawędź płyty",
      "text": "Nawet prawidłowo ustawiona piła może zostawić miejscowe nierówności lub ślady posuwu. Na takiej powierzchni warstwa kleju bywa nierównomierna. Moduł wstępnego frezowania z frezarką 1600 W służy do przygotowania krawędzi przed oklejaniem; nie jest zamiennikiem okleiniarki. W przypadku płyt już równych dodatkowe frezowanie może być zbędne."
    },
    {
      "heading": "Kolejność ma znaczenie",
      "text": "Najpierw uzyskaj prostą, stabilną krawędź, potem sprawdź czystość i temperaturę klejenia, a dopiero po przyklejeniu usuń nadmiar obrzeża. Dla PVC ręczny trymer 2w1 z cykliną R2 pozwala wykonać wykończenie po klejeniu. Profil R2 nie pasuje automatycznie do każdego obrzeża i każdej grubości płyty — sprawdź efekt na próbce."
    },
    {
      "heading": "Czego nie kupować na zapas",
      "text": "Jeżeli pracujesz wyłącznie z fabrycznie równą płytą i sporadycznie oklejasz krótkie odcinki, najpierw dopracuj ustawienie kleju i docisku. Przy dużej liczbie elementów o krawędziach po rozkroju moduł frezowania wstępnego może ograniczyć reklamacje. Zweryfikuj przy tym zgodność płyty montażowej i tulei frezarki z posiadanym stołem."
    }
  ],
  "links": [
    {
      "label": "Okleiniarki i osprzęt",
      "href": "/kategoria/okleiniarka"
    },
    {
      "label": "Katalog narzędzi",
      "href": "/"
    }
  ]
},
  {
  "slug": "pila-pierscieniowa-reczna-czy-prowadnica",
    "published": "2026-11-03",
  "title": "Piła pierścieniowa ręczna czy na prowadnicy?",
  "description": "Kiedy prowadnica ręczna lub elektryczna ułatwia cięcie betonu i żelbetu.",
  "heading": "Piła pierścieniowa: praca z ręki, prowadnica ręczna czy elektryczna?",
  "sections": [
    {
      "heading": "Cięcie krótkie i trudno dostępne",
      "text": "Praca z ręki daje mobilność przy lokalnych otworach i krótkich nacięciach, ale wymaga stałej kontroli położenia piły i obciążenia operatora. Przy wyborze porównaj realną głębokość, masę, dopływ wody i dostęp do prowadnicy pierścienia. Maksymalna głębokość około 317 mm przy pierścieniu 410 mm nie oznacza, że dowolny beton można przeciąć jednym szybkim przejściem."
    },
    {
      "heading": "Długie cięcie po linii",
      "text": "Przy wielu równoległych lub pionowych cięciach szyna ułatwia utrzymanie toru i ogranicza konieczność podtrzymywania narzędzia. W ofercie występują prowadnice ręczne 2,5 m oraz wersje elektryczne z pilotem, posuwem wzdłużnym i zagłębianiem. Przed zakupem porównaj sposób mocowania szyny, przestrzeń na dojazd, długość cięcia i kompatybilność wózka z konkretną piłą."
    },
    {
      "heading": "Sterowanie nie zwalnia z oceny ryzyka",
      "text": "Prowadnica elektryczna pozwala sterować posuwem z dystansu, ale nie zastępuje bezpiecznego kotwienia, chłodzenia i sprawdzenia instalacji w ścianie. Nie wciskaj jednocześnie komend posuwu i zagłębiania, jeśli instrukcja zabrania takiej pracy. W żelbecie zachowaj odpowiednią kolejność nacięć, aby odcinany fragment nie zakleszczył pierścienia."
    }
  ],
  "links": [
    {
      "label": "Piły do betonu",
      "href": "/kategoria/pila-pierscieniowa"
    },
    {
      "label": "Podstawy doboru piły",
      "href": "/poradnik/pila-pierscieniowa-do-betonu"
    }
  ]
},
  {
  "slug": "eksploatacja-pily-pierscieniowej-pierscien-prowadnica",
    "published": "2026-11-03",
  "title": "Pierścień, prowadnica i woda — koszty eksploatacji piły",
  "description": "Jak oceniać zużycie pierścieni i prowadnic oraz uniknąć przedwczesnej wymiany.",
  "heading": "Eksploatacja piły pierścieniowej: co zużywa się pierwsze?",
  "sections": [
    {
      "heading": "Pierścień i prowadnica to różne części",
      "text": "Przy zakupie piły sprawdź nie tylko cenę pierścienia diamentowego, lecz także dostępność prowadnicy, kół zębatych i rolek. Zużyty lub źle ustawiony element prowadzący przyspiesza zużycie kolejnego pierścienia. Planowanie zapasów powinno wynikać z faktycznych metrów cięcia i rodzaju betonu, a nie z jednego deklarowanego przebiegu."
    },
    {
      "heading": "Woda, urobek i zużycie",
      "text": "Ciągły dopływ wody chłodzi segmenty i wypłukuje szlam. Zbyt mały przepływ, zatkany przewód albo długie cięcie bez wypłukiwania może przegrzewać zespół. Gdy tempo spada, najpierw sprawdź dopływ wody, stan segmentów i prowadnicy; silniejszy nacisk nie jest właściwą metodą kompensowania problemu."
    },
    {
      "heading": "Kontrola przed kolejnym zleceniem",
      "text": "Po umyciu i odłączeniu zasilania sprawdź pierścień pod kątem pęknięć, nierównego zużycia segmentów, luzów i obcego materiału w mechanizmie. Zaplanuj zapas na długie cięcia, a po zmianie pierścienia wykonaj próbę zgodnie z instrukcją. W przypadku wyczuwalnych drgań przerwij pracę i ustal przyczynę przed dalszym użytkowaniem."
    }
  ],
  "links": [
    {
      "label": "Piły pierścieniowe",
      "href": "/kategoria/pila-pierscieniowa"
    },
    {
      "label": "Katalog TrendEco",
      "href": "/"
    }
  ]
},
  {
  "slug": "luparka-gotowa-czy-modul-jzq250",
    "published": "2026-11-03",
  "title": "Łuparka gotowa, moduł mechaniczny czy przekładnia JZQ250?",
  "description": "Co trzeba policzyć przy wyborze gotowej łuparki i budowie własnego napędu.",
  "heading": "Gotowa łuparka czy moduł z przekładnią JZQ250?",
  "sections": [
    {
      "heading": "Trzy poziomy kompletności",
      "text": "Gotowa łuparka POLMECH.TECH 400 V 3 kW obejmuje zmontowany układ i sterowanie przewidziane dla tego modelu. Moduł mechaniczny bez silnika i sterowania wymaga zaprojektowania napędu i zabezpieczeń. Sama przekładnia JZQ250 z kołami pasowymi i paskami jest elementem układu, a nie urządzeniem do rozłupywania drewna. Tych ofert nie można porównywać jedynie po cenie zakupu."
    },
    {
      "heading": "Co oznacza przełożenie 48,57:1",
      "text": "Przekładnia obniża prędkość wyjściową względem wejściowej, lecz o rzeczywistym tempie pracy decydują także średnice kół pasowych, obroty silnika oraz obciążenie. W opisanym zestawie napędowym podano koła 210 i 70 mm oraz maksymalną prędkość wejściową 1500 obr./min. Dobór silnika wymaga obliczenia momentu, obciążenia łożysk, doboru pasów oraz sprawdzenia pracy całej konstrukcji."
    },
    {
      "heading": "Najważniejsze pytanie: kto odpowiada za maszynę",
      "text": "Własny montaż oznacza konieczność zaprojektowania osłon, zatrzymania awaryjnego, zabezpieczenia przed samoczynnym restartem i bezpiecznej procedury usuwania zakleszczeń. Gotowa maszyna wymaga użytkowania zgodnie z instrukcją, ale nie przenosi na kupującego projektowania całego układu. Przy sporadycznym rozłupywaniu zwykle warto najpierw oszacować całkowity koszt budowy, prób i odpowiedzialności."
    }
  ],
  "links": [
    {
      "label": "Łuparki i napędy",
      "href": "/kategoria/luparka-przekladniowa"
    },
    {
      "label": "POLMECH.TECH",
      "href": "https://polmech.tech"
    }
  ]
},
  {
  "slug": "jak-dobierac-polano-do-luparki-przekladniowej",
    "published": "2026-11-03",
  "title": "Jak przygotować drewno do łuparki przekładniowej?",
  "description": "Kształt, sęki, wilgotność i bezpieczne podawanie polan do mechanicznej łuparki.",
  "heading": "Drewno do łuparki: sęki, wilgotność i sposób podawania",
  "sections": [
    {
      "heading": "Nie każda średnica oznacza takie samo obciążenie",
      "text": "Dwa polana o tej samej średnicy mogą zachowywać się zupełnie inaczej. Krótkie suche drewno o prostym włóknie zwykle rozdziela się inaczej niż mokra, rozwidlona lub silnie sękata kłoda. Podawane wartości wydajności są orientacyjne i nie powinny być traktowane jako gwarancja dla dowolnego gatunku drewna."
    },
    {
      "heading": "Dobieraj miejsce pierwszego rozłupania",
      "text": "Przed podaniem oceń przebieg włókien, pęknięcia i rozwidlenia. W twardych nieregularnych polanach korzystne może być rozpoczęcie od krawędzi, zamiast wymuszania przejścia przez środek największego sęka. Nie należy jednak przytrzymywać drewna rękami przy ruchomym klinie ani zmieniać położenia materiału podczas ruchu mechanizmu."
    },
    {
      "heading": "Procedura przy zakleszczeniu",
      "text": "Stosuj wyłącznie przewidziane przez producenta sterowanie cofania i zatrzymywania. Przed usuwaniem zakleszczonego drewna zatrzymaj i odłącz napęd zgodnie z instrukcją. W zestawie POLMECH.TECH opisano specjalne kleszcze do podawania polan; nie zastępują one osłon ani bezpiecznej odległości operatora od toru klinów."
    }
  ],
  "links": [
    {
      "label": "Łuparki do drewna",
      "href": "/kategoria/luparka-przekladniowa"
    },
    {
      "label": "Porównanie zasilania",
      "href": "/poradnik/luparka-przekladniowa-230v-czy-400v"
    }
  ]
},
  {
  "slug": "szablon-do-zamkow-a-przystawka-do-rowkow",
    "published": "2026-11-03",
  "title": "Szablon do zamków czy przystawka do rowków?",
  "description": "Jak odróżnić przyrząd WB260 do drzwi od zestawu frezarskiego do połączeń meblowych.",
  "heading": "Frezowanie gniazd: szablon do zamka czy prowadnica do rowków?",
  "sections": [
    {
      "heading": "Inny punkt odniesienia",
      "text": "Przy zamku wpuszczanym punktem odniesienia jest krawędź skrzydła drzwi i położenie okuć. Szablon WB260 ma regulowane zaciski do drzwi o grubości 35–100 mm i prowadzi frez na określonym odcinku. Przystawka do rowków i połączeń meblowych służy natomiast do ustawiania toru względem płaszczyzny i krawędzi elementu przy kolejnych powtarzalnych operacjach."
    },
    {
      "heading": "Najpierw zgodność freza",
      "text": "W zestawie WB260 wskazano frezy M10 o średnicach 18, 22 i 24 mm. W zestawie z frezarką i przystawką do rowków występuje tuleja 8 mm oraz zakres obrotów frezarki 15 000–30 000 obr./min. Sama podobna średnica frezu nie oznacza zgodności trzpienia ani bezpiecznego mocowania. Sprawdź gwint, tuleję, kierunek obrotów i maksymalną głębokość pracy."
    },
    {
      "heading": "Zacznij od próbki",
      "text": "Przy drzwiach błędne położenie gniazda może trwale uszkodzić skrzydło. Przy połączeniach meblowych nawet mała rozbieżność wymiaru utrudni montaż całej serii. Dlatego przygotuj wzornik, zmierz okucia lub łącznik i wykonaj próbę na odpadowym materiale o tej samej grubości."
    }
  ],
  "links": [
    {
      "label": "Narzędzia stolarskie",
      "href": "/"
    },
    {
      "label": "Katalog TrendEco",
      "href": "/"
    }
  ]
},
  {
  "slug": "przecinarka-reczna-do-gresu-i-kolko-tnace",
    "published": "2026-11-03",
  "title": "Przecinarka do gresu 1200 mm i kółko 22 mm — dobór",
  "description": "Długość cięcia, rodzaj płytki i kompatybilność kółka w ręcznej przecinarce.",
  "heading": "Ręczna przecinarka do płytek: prowadnica, docisk i kółko tnące",
  "sections": [
    {
      "heading": "Długość nominalna to tylko początek",
      "text": "Przecinarka ręczna o długości 1200 mm odpowiada na potrzebę cięcia większych formatów, ale sprawdź także maksymalną grubość płytki, dopuszczalny format cięcia po przekątnej i przestrzeń do podparcia całej płyty. Długą płytkę łatwo uszkodzić, jeśli jej koniec zwisa poza stół. Wybierz stanowisko, na którym materiał nie będzie się kołysał."
    },
    {
      "heading": "Kółko musi pasować do uchwytu",
      "text": "Łożyskowane kółko o średnicy 22 mm nie jest uniwersalnym zamiennikiem do każdej przecinarki. Weryfikuj średnicę trzpienia, szerokość, geometrię mocowania i zalecenia producenta. Zużyte kółko może rysować nierówno; zbyt mocne nacinanie również pogarsza wynik, szczególnie na twardym gresie."
    },
    {
      "heading": "Próbuj cięcia i łamania osobno",
      "text": "Na odpadowej płytce sprawdź jednolity nacisk podczas jednego prowadzenia kółka, a następnie sposób łamania. Przy bardzo twardym lub strukturalnym materiale wynik zależy od konkretnej płytki i techniki. W razie niestabilnego przełomu nie zwiększaj bez końca siły — oceń dobór kółka i możliwość zastosowania innej technologii cięcia."
    }
  ],
  "links": [
    {
      "label": "Narzędzia budowlane",
      "href": "/kategoria/przecinarka-do-plytek"
    },
    {
      "label": "Oferta TrendEco",
      "href": "/"
    }
  ]
},
  {
  "slug": "stol-rolkowy-przymiar-i-oslona-pily",
    "published": "2026-11-03",
  "title": "Podparcie, przymiar i osłona piły — dobór osprzętu",
  "description": "Jak poprawić organizację stanowiska bez ryzykownej przeróbki pilarki.",
  "heading": "Osprzęt do pilarki: stojak rolkowy, przymiar i osłona",
  "sections": [
    {
      "heading": "Podparcie długiego elementu",
      "text": "Regulowany stojak rolkowy pomaga odbierać lub podawać długi element, jeśli jego wysokość i oś rolki są ustawione do poziomu stołu. Nie powinien wymuszać bocznego przesuwu deski ani podnosić końca materiału. Gdy materiał jest szeroki i ma skłonność do przechylania, jedna rolka nie zawsze daje wystarczającą stabilność."
    },
    {
      "heading": "Przymiar tylko z potwierdzoną geometrią",
      "text": "Długi liniał lub prowadnica 2290 mm jest przydatna do ustawiania powtarzalnego wymiaru, ale przed zakupem sprawdź sposób mocowania, liczbę punktów podparcia i czy skala odnosi się do właściwej krawędzi cięcia. Sam długi profil nie zapewnia prostoliniowości, jeśli ugina się lub ma luz na prowadzeniu."
    },
    {
      "heading": "Osłona nie może przeszkadzać w funkcji ochronnej",
      "text": "Przezroczysta osłona tarczy ułatwia obserwację obszaru cięcia, lecz nie jest uniwersalna. Sprawdź kompatybilność mocowania, wysokość tarczy, odciąg i wymagania dla klina rozszczepiającego. Nie usuwaj fabrycznych zabezpieczeń wyłącznie po to, by dopasować akcesorium; osłona musi pozostać skuteczna przy całym przewidzianym zakresie regulacji."
    }
  ],
  "links": [
    {
      "label": "Akcesoria warsztatowe",
      "href": "/kategoria/pila-stolowa"
    },
    {
      "label": "Poradnik piły formatowej",
      "href": "/poradnik/jak-wybrac-pile-formatowa"
    }
  ]
},
  {
  "slug": "moc-silnika-do-luparki-jzq250-3kw-4kw",
  "published": "2026-11-03",
  "title": "Silnik do łuparki z reduktorem JZQ250 — 3 kW, 4 kW czy więcej?",
  "description": "Dlaczego większa moc nie oznacza szybszego łupania? Dobór silnika 400 V, prędkości klina i zabezpieczenia przed udarem.",
  "heading": "Jak dobrać moc silnika do łuparki przekładniowej z reduktorem JZQ250",
  "sections": [
    {
      "heading": "Zacznij od przełożenia i prędkości, nie od liczby kilowatów",
      "text": "W napędzie łuparki mechanicznej silnik, koła pasowe i reduktor tworzą jeden układ. Prędkość wału roboczego zależy przede wszystkim od obrotów silnika oraz przełożeń pasowego i zębatego. Jeżeli zamienisz silnik 3 kW na jednostkę 5,5 kW o zbliżonych obrotach, klin nie zacznie wykonywać większej liczby cykli w ciągu minuty. Zyskasz potencjalny zapas momentu napędowego, ale nie automatycznie wydajność w metrach przestrzennych drewna na godzinę."
    },
    {
      "heading": "Dlaczego POLMECH.TECH stosuje 3 kW / 400 V",
      "text": "Gotowa łuparka przekładniowa POLMECH.TECH została skonfigurowana i sprawdzona z trójfazowym silnikiem PROMOTOR 3 kW / 400 V. W samodzielnych projektach opartych na analogicznym układzie JZQ250 rozważa się również 4 kW, lecz wymaga to oceny pasów, wałów, kół zębatych, mocowań i sterowania. Rekomendacja 3–4 kW dotyczy tej konstrukcji napędu, a nie każdej przekładni oznaczonej JZQ250 w dowolnym zastosowaniu."
    },
    {
      "heading": "Co naprawdę dzieje się przy zablokowaniu klina",
      "text": "Podczas rozłupywania włókna drewna odkształcają się, rozciągają i stopniowo pękają. Obciążenie może być wysokie, ale materiał zwykle nie jest idealnie sztywną przeszkodą. Inaczej jest, gdy w strefie roboczej znajdzie się metalowy łom albo inny praktycznie nieodkształcalny przedmiot. Gwałtowne zatrzymanie klina powoduje nagłą zmianę prędkości obracających się mas. Energia kinetyczna zgromadzona w silniku, kołach i wałach musi zostać wytracona, a chwilowe obciążenie zębów może przewyższyć normalny moment roboczy. Następstwem bywa wykruszenie zębów, uszkodzenie wału lub elementów przeniesienia napędu."
    },
    {
      "heading": "Czy większy silnik zawsze pobiera więcej prądu?",
      "text": "Nie. Moc znamionowa określa zdolność silnika do oddawania mocy mechanicznej w określonych warunkach, a chwilowy pobór zależy od rzeczywistego obciążenia, sprawności i charakterystyki jednostki. Mocniejszy napęd może jednak dostarczyć większy moment podczas trudnej pracy, a przy wykorzystaniu tej rezerwy zużyć więcej energii. W projekcie z ograniczoną nośnością przekładni taka rezerwa może być bardziej zagrożeniem niż korzyścią. Nie warto traktować przewymiarowania jako sposobu na omijanie zakleszczeń."
    },
    {
      "heading": "Jak ograniczać skutki przeciążenia w projekcie własnym",
      "text": "Należy zweryfikować dopuszczalny moment i obciążenia dynamiczne reduktora, właściwości napędu pasowego oraz sposób zatrzymania maszyny. W razie potrzeby przewiduje się sprzęgło przeciążeniowe, ogranicznik momentu albo inny skuteczny element mechaniczny dobrany do układu. Zabezpieczenie termiczne silnika i wyłącznik START/STOP nie zastąpią automatycznie ochrony zębów przed krótkim udarem. Dobór oraz montaż zabezpieczeń musi wynikać z oceny ryzyka całej maszyny, także przy nieoczekiwanym przedmiocie w torze klina."
    },
    {
      "heading": "Co wybrać przy zakupie modułu lub samego reduktora",
      "text": "Jeżeli potrzebujesz gotowej maszyny do drewna opałowego, punktem odniesienia jest sprawdzona konfiguracja 3 kW / 400 V. Jeżeli kupujesz osobny moduł mechaniczny lub przekładnię JZQ250 do własnej konstrukcji, najpierw wykonaj obliczenia i określ sposób ograniczenia momentu, a dopiero potem zamawiaj silnik. W POLMECH.TECH można zapytać o dostępność i cenę trójfazowych silników 3 kW oraz 4 kW / 400 V. Silnik mocniejszy niż 4 kW wymaga odrębnego przeprojektowania i sprawdzenia obciążeń; samo zwiększenie mocy nie jest zalecaną modyfikacją."
    }
  ],
  "links": [
    {
      "label": "Łuparki i przekładnie",
      "href": "/kategoria/luparka-przekladniowa"
    },
    {
      "label": "POLMECH.TECH — konstrukcja napędu",
      "href": "https://polmech.tech"
    },
    {
      "label": "230 V czy 400 V?",
      "href": "/poradnik/luparka-przekladniowa-230v-czy-400v"
    }
  ]
}
];

export const getSeoGuide = (slug: string) => seoGuides.find((guide) => guide.slug === slug);
