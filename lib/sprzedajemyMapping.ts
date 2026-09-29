export type SprzedajemyMapping = { categoryId:number; category:string; attributes:Record<string,string|number|boolean> };

const exact: Record<string, [number,string]> = {
 "18958388796":[19299,"Wiertarki i wkrętarki"],
 "18935351212":[19323,"Zestawy osprzętu"],
 "18935347812":[19350,"Włączniki"],
 "18935337683":[1464,"Magazynowanie"],
 "18935303663":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18935299960":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18902521031":[19202,"Frezarki"],
 "18901393010":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18901386785":[1465,"Produkcja"],
 "18901381491":[19232,"Noże i ostrza"],
 "18901376338":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18901370333":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18901369031":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18901367414":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18891625103":[1465,"Produkcja"],
 "18891622310":[19204,"Frezarki i strugi - Pozostałe"],
 "18891618377":[1465,"Produkcja"],
 "18891612769":[1465,"Produkcja"],
 "18891603535":[1465,"Produkcja"],
 "18878600668":[19339,"Przekładnie"],
 "18793690873":[19277,"Wzorniki i szablony"],
 "18775349997":[1465,"Produkcja"],
 "18775348117":[1465,"Produkcja"],
 "18775316962":[1465,"Produkcja"],
 "18690943268":[19240,"Narzędzia ręczne - Pozostałe"],
 "18690940209":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18690937061":[19337,"Prowadnice"],
 "18690927460":[10897,"Leśnictwo"],
 "18690919967":[10897,"Leśnictwo"],
 "18690915823":[19337,"Prowadnice"],
 "18550986067":[19273,"Miary i taśmy"],
 "18550963921":[19204,"Frezarki i strugi - Pozostałe"],
 "18550962217":[19324,"Osprzęt do elektronarzędzi - Pozostałe"],
 "18550959962":[19334,"Osłony"],
 "18550953191":[1465,"Produkcja"],
 "18550950641":[1465,"Produkcja"],
 "18550932673":[1465,"Produkcja"],
 "18550930467":[1465,"Produkcja"],
 "18550928835":[19202,"Frezarki"]
};

const sawIds = new Set([
 "18901362815","18901357565","18901353022","18901345311","18891593931","18775655922",
 "18775352139","18775345984","18775342926","18775338435","18775336284","18775332230",
 "18775329625","18775322985","18775320803","18550988265","18550965218","18550934081"
]);

export function sprzedajemyMapping(id:string, price:string|number): SprzedajemyMapping {
 const pair = sawIds.has(id) ? [19256,"Piły stołowe"] as [number,string] : exact[id];
 if (!pair) throw new Error(`Brak mapowania Sprzedajemy dla produktu ${id}`);
 const attributes:Record<string,string|number|boolean>={price:Number(price),condition:1};
 // Sprzedajemy uses a closed brand dictionary. Our own brands use the allowed value "Inna".
 if ([19256,19299,19202,19324,19337,19339,19204,19323,19350,19232,19277,19240,19273,19334].includes(pair[0])) attributes["2692_marka"]=212270;
 if(id==="18901381491") attributes["2821_typ"]=212480;
 if(id==="18550986067"){ attributes["2989_rodzaj"]=212775; attributes["2990_dlugosc"]=2290; }
 if(id==="18958388796"){
   attributes["3137_typ"]=213028; // wiertarka
   attributes["3138_zasilanie"]=213032; // sieciowe
   attributes["3139_rodzaj"]=213035; // bezudarowa
 }
 if(id==="18902521031"){
   attributes["2711_rodzaj"]=212298; // górnowrzecionowa
   attributes["2712_zasilanie"]=212305; // sieciowe
   attributes["2713_maksymalna-moc"]=1600;
 }
 if(id==="18550928835"){
   attributes["2711_rodzaj"]=212300; // lamelownica
   attributes["2712_zasilanie"]=212305;
   attributes["2713_maksymalna-moc"]=1500;
 }
 return {categoryId:pair[0],category:pair[1],attributes};
}
