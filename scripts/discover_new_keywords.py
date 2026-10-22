#!/usr/bin/env python3
"""Public Google autocomplete research; suggestions are NOT search-volume estimates.
No account access, scraping of result pages, or automated publishing.
"""
import json, time, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

PRODUCTS={
 "TrendEco Profi Bud": {"site":"trendeco.eu","seeds":["piła pierścieniowa do betonu","piła pierścieniowa do żelbetu","piła do cięcia betonu 230v"]},
 "POLMECH.TECH łuparka": {"site":"polmech.tech","seeds":["łuparka do drewna przekładniowa","łuparka do drewna 400v","łuparka do sękatego drewna"]},
 "TrendEco piła formatowa": {"site":"trendeco.eu","seeds":["piła formatowa do mebli","pilarka formatowa do płyt meblowych"]},
 "TrendEco prowadnica": {"site":"trendeco.eu","seeds":["prowadnica zębata do piły pierścieniowej","prowadnica do cięcia betonu"]},
 "WIDIA.TECH": {"site":"widia.tech","seeds":["narzędzia skrawające do metalu","frez do metalu widia"]},
}
MODIFIERS=[""," cena"," kup"," profesjonalna"," do warsztatu"]
def suggest(query):
    params=urllib.parse.urlencode({"client":"firefox","hl":"pl","gl":"pl","q":query})
    request=urllib.request.Request("https://suggestqueries.google.com/complete/search?"+params,
       headers={"User-Agent":"Mozilla/5.0 (compatible; TrendEcoResearch/1.0)"})
    with urllib.request.urlopen(request,timeout=12) as response:
        result=json.load(response)
    return [s for s in result[1] if isinstance(s,str)] if isinstance(result,list) and len(result)>1 else []
def main():
    Path("output").mkdir(exist_ok=True)
    records=[];errors=[]
    for product,info in PRODUCTS.items():
        seen=set()
        for seed in info["seeds"]:
            for suffix in MODIFIERS:
                query=seed+suffix
                try:
                    results=suggest(query)
                    for phrase in results:
                        key=phrase.casefold().strip()
                        if key not in seen:
                            seen.add(key)
                            records.append({"product":product,"site":info["site"],"seed":seed,
                              "suggestion":phrase,"source":"Google autocomplete (PL)","search_volume":None})
                except Exception as exc:
                    errors.append({"query":query,"error_type":type(exc).__name__})
                time.sleep(.25)
    report={"generated_at_utc":datetime.now(timezone.utc).isoformat(),
      "note":"Suggestions indicate phrases surfaced by autocomplete, not proven demand, rankings or sales.",
      "suggestions":records,"errors":errors}
    (Path("output")/"new-keywords.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    lines=["# Nowe frazy do weryfikacji — TrendEco","",
      "Sugestie Google nie oznaczają znanej liczby wyszukiwań ani gwarantowanych zamówień.",""]
    for product in PRODUCTS:
        lines+=["## "+product]
        matches=[r for r in records if r["product"]==product]
        lines += ["- "+r["suggestion"] for r in matches[:35]]
        lines+=[""]
    if errors: lines+=["Błędy pobierania: "+str(len(errors))+". Zobacz JSON."]
    (Path("output")/"new-keywords.md").write_text("\n".join(lines),encoding="utf-8")
    print(f"Collected {len(records)} unique product-matched suggestions; errors: {len(errors)}")
if __name__=="__main__":main()
