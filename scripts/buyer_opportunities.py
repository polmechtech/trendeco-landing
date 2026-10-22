#!/usr/bin/env python3
"""Analyze exported Google Search Console CSV, produce prioritized Polish SEO briefs.
Input columns: query,clicks,impressions,ctr,position (Polish headers supported).
Never publishes, invents product specifications or changes marketplace accounts.
"""
import csv, json, os, re
from pathlib import Path
from datetime import datetime, timezone

PRODUCTS = [
 ("piła pierścieniowa TrendEco Profi Bud",["piła pierścieniowa","pilarka pierścieniowa","cięcie betonu","cięcie żelbetu","ring saw"],"https://trendeco.eu"),
 ("łuparka przekładniowa POLMECH.TECH",["łuparka","łupanie drewna","rozłupywanie drewna","sękate drewno"],"https://polmech.tech"),
 ("prowadnica zębata TrendEco",["prowadnica zębata","prowadnica do piły","prowadnica piły pierścieniowej"],"https://trendeco.eu"),
 ("narzędzia skrawające WIDIA.TECH",["widia","narzędzia skrawające","frez","tarcza tnąca"],"https://widia.tech")
]
def numeric(value):
    try: return float(str(value).strip().replace("%","").replace(" ","").replace(",","."))
    except (ValueError,TypeError): return 0.
def normalize(row):
    lower={str(k).strip().lower():v for k,v in row.items()}
    def val(*names): return next((lower[n] for n in names if n in lower),"")
    return {"query":str(val("query","queries","zapytanie","zapytania","najczęstsze zapytania")).strip(),
            "clicks":numeric(val("clicks","kliknięcia","klikniecia")),
            "impressions":numeric(val("impressions","wyświetlenia","wyswietlenia")),
            "position":numeric(val("position","pozycja","średnia pozycja","srednia pozycja"))}
def main():
    path=Path(os.environ.get("GSC_CSV","data/gsc_queries.csv"))
    out=Path("output");out.mkdir(exist_ok=True)
    rows=[]
    if path.exists():
        with path.open(encoding="utf-8-sig",newline="") as f:
            sample=f.read(4096);f.seek(0)
            dialect=csv.Sniffer().sniff(sample,delimiters=",;\t")
            rows=[normalize(r) for r in csv.DictReader(f,dialect=dialect)]
    matches=[]
    for row in rows:
        if not row["query"] or row["impressions"] < 5: continue
        for product,terms,url in PRODUCTS:
            if any(t in row["query"].casefold() for t in terms):
                pos=row["position"]
                # prioritize visible queries with room to improve; don't treat as predicted sales
                score=round(row["impressions"]*(1/(1+row["clicks"]))*(1 if 4<=pos<=30 else .3),2)
                matches.append({**row,"product":product,"site":url,"priority_score":score})
                break
    matches.sort(key=lambda r:r["priority_score"],reverse=True)
    result={"generated_at":datetime.now(timezone.utc).isoformat(),"source":str(path) if path.exists() else "none",
            "note":"Priority is heuristic, not buyer intent or forecast sales.","opportunities":matches[:30]}
    (out/"buyer-opportunities.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
    lines=["# TrendEco — szanse SEO","",f"Źródło: {result['source']}","",
           "Wyniki są propozycjami do weryfikacji, nie potwierdzoną sprzedażą.",""]
    for item in matches[:20]:
        q=item["query"].replace("\n"," ").replace("\r"," ")
        lines += [f"## {q}",f"- Produkt: {item['product']}",f"- Wyświetlenia: {int(item['impressions'])}; kliknięcia: {int(item['clicks'])}; pozycja: {item['position']}",
                  f"- Temat materiału: Jak wybrać rozwiązanie dla zapytania «{q}»?",
                  "- Szkic: opisz problem użytkownika, kryteria wyboru, ograniczenia, potwierdzone dane produktu i link do oferty.",
                  "- Przed publikacją: sprawdź parametry, unikalność treści i zgodność z intencją wyszukiwania.",""]
    if not matches: lines+=["Brak dopasowanych danych. Dodaj eksport zapytań Search Console jako data/gsc_queries.csv.",""]
    (out/"buyer-opportunities.md").write_text("\n".join(lines),encoding="utf-8")
    print(f"Matched {len(matches)} queries; report: output/buyer-opportunities.md")
if __name__=="__main__": main()
