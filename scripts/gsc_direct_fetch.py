#!/usr/bin/env python3
"""Fetch verified GSC query data via Google Search Console API (read-only).
Requires GSC_SERVICE_ACCOUNT_JSON and google-auth. Never logs credentials.
"""
import csv, io, json, os, sys
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from google.oauth2 import service_account
from google.auth.transport.requests import Request as AuthRequest

SCOPES=["https://www.googleapis.com/auth/webmasters.readonly"]
SITES={
    "trendeco": os.getenv("GSC_SITE_TRENDECO","sc-domain:trendeco.eu"),
    "polmech": os.getenv("GSC_SITE_POLMECH","sc-domain:polmech.tech"),
    "widia": os.getenv("GSC_SITE_WIDIA","sc-domain:widia.tech"),
}
def main():
    secret=os.getenv("GSC_SERVICE_ACCOUNT_JSON","")
    if not secret:
        print("Missing GSC_SERVICE_ACCOUNT_JSON GitHub Actions secret",file=sys.stderr)
        sys.exit(2)
    credentials=service_account.Credentials.from_service_account_info(json.loads(secret),scopes=SCOPES)
    credentials.refresh(AuthRequest())
    end=date.today()-timedelta(days=3)
    start=end-timedelta(days=27)
    Path("data").mkdir(exist_ok=True)
    Path("output").mkdir(exist_ok=True)
    summary=[]
    for name,site in SITES.items():
        url="https://www.googleapis.com/webmasters/v3/sites/"+quote(site,safe="")+"/searchAnalytics/query"
        body=json.dumps({"startDate":start.isoformat(),"endDate":end.isoformat(),
                         "dimensions":["query"],"rowLimit":25000,"startRow":0,"type":"web"}).encode()
        request=Request(url,data=body,headers={"Authorization":"Bearer "+credentials.token,
                     "Content-Type":"application/json"},method="POST")
        try:
            with urlopen(request,timeout=35) as response:
                result=json.load(response)
        except HTTPError as exc:
            print(f"{name}: GSC HTTP {exc.code} ({exc.reason}) for property {site}",file=sys.stderr)
            summary.append({"site":name,"status":"error","http_status":exc.code,"property":site})
            continue
        except Exception as exc:
            print(f"{name}: GSC request failed ({type(exc).__name__}); verify property and access",file=sys.stderr)
            summary.append({"site":name,"status":"error","error_type":type(exc).__name__})
            continue
        rows=result.get("rows",[])
        path=Path("data")/f"gsc_{name}.csv"
        with path.open("w",encoding="utf-8",newline="") as file:
            writer=csv.writer(file)
            writer.writerow(["query","clicks","impressions","ctr","position"])
            for row in rows:
                writer.writerow([(row.get("keys") or [""])[0],row.get("clicks",0),
                    row.get("impressions",0),row.get("ctr",0),row.get("position",0)])
        summary.append({"site":name,"status":"ok","rows":len(rows),"property":site})
        print(f"{name}: {len(rows)} query rows exported")
    Path("output/gsc-fetch-status.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf-8")
    if not any(s["status"]=="ok" for s in summary): sys.exit(1)
if __name__=="__main__":main()
