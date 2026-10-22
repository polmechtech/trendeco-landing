#!/usr/bin/env python3
"""Read-only organic visibility checks for TrendEco group. No account mutations."""
import json, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

SITES = ("https://trendeco.eu", "https://polmech.tech", "https://widia.tech")
def check(site):
    result = {"site": site, "checks": {}, "warnings": []}
    for endpoint in ("/robots.txt", "/sitemap.xml"):
        url = site + endpoint
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "TrendEcoBuyerBot/1.0"})
            with urllib.request.urlopen(request, timeout=15) as response:
                body = response.read(2000000).decode("utf-8", "replace")
                result["checks"][endpoint] = {"status": response.status, "url": response.url}
            if endpoint == "/sitemap.xml":
                root = ET.fromstring(body)
                result["checks"][endpoint]["locations"] = sum(
                    1 for element in root.iter() if element.tag.split("}")[-1] == "loc"
                )
            elif "Sitemap:" not in body and "sitemap:" not in body:
                result["warnings"].append("No sitemap declaration in robots.txt")
        except Exception as error:
            result["warnings"].append(f"{endpoint}: {type(error).__name__}: {error}")
    return result

def main():
    report = {"checked_at_utc": datetime.now(timezone.utc).isoformat(), "sites": [check(s) for s in SITES]}
    Path("output").mkdir(exist_ok=True)
    Path("output/visibility.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = ["# TrendEco organic visibility report", "", report["checked_at_utc"], ""]
    for site in report["sites"]:
        lines += ["## " + site["site"], "Sitemap entries: " + str(site["checks"].get("/sitemap.xml", {}).get("locations", "unavailable"))]
        lines += ["- " + w for w in site["warnings"]]
        lines += [""]
    Path("output/visibility.md").write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))

if __name__ == "__main__":
    main()
