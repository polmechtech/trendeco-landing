type ProductLike = {
  id: string;
  name: string;
  description?: string;
  parameters?: { name: string; values?: string[] }[];
};

const BRAND_BY_ID: Record<string, string> = {
  "18690919967": "POLMECH.TECH",
  "18690927460": "POLMECH.TECH",
  "18878600668": "POLMECH.TECH",
  "18901369031": "WIDIA.TECH",
  "18901367414": "WIDIA.TECH",
  "18901370333": "WIDIA.TECH",
  "18901376338": "WIDIA.TECH",
  "18958388796": "Rebir",
};

function brand(p: ProductLike) {
  if (BRAND_BY_ID[p.id]) return BRAND_BY_ID[p.id];
  const text = `${p.name} ${p.description ?? ""}`;
  if (/POLMECH\.TECH/i.test(text)) return "POLMECH.TECH";
  if (/WIDIA\.TECH/i.test(text)) return "WIDIA.TECH";
  if (/\bRebir\b/i.test(text)) return "Rebir";
  return "TrendEco";
}

function cleanTitle(name: string, b: string) {
  let s = name
    .replace(/\bTrendEco\b/gi, "")
    .replace(/\bPOLMECH\.TECH\b/gi, "")
    .replace(/\bWIDIA\.TECH\b/gi, "")
    .replace(/\bRebir\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const replacements: [RegExp, string][] = [
    [/oklejarka okleiniarka/gi, "okleiniarka"],
    [/okleiniarka oklejarka/gi, "okleiniarka"],
    [/piła stołowa pilarka/gi, "piła stołowa"],
    [/piła formatowa stołowa pilarka/gi, "piła formatowa"],
    [/przenośna mobilna/gi, "mobilna"],
    [/stolikowa stołowa/gi, "stołowa"],
    [/do piła /gi, "do piły "],
    [/\s+/g, " "],
  ];
  for (const [re, value] of replacements) s = s.replace(re, value).trim();
  const title = `${b} ${s}`.replace(/\s+/g, " ").trim();
  if (title.length <= 75) return title;
  return title.slice(0, 75).replace(/\s+\S*$/, "").replace(/\s+(do|z|ze|i|oraz|dla|bez|na|w)$/i, "").trim();
}

function stripMarkup(text: string) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[^\p{L}\p{N}\s.,;:()/%+×x–—-]/gu, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function usefulParagraphs(description: string) {
  const chunks = stripMarkup(description).split(/\n\n+/).map(x => x.trim()).filter(Boolean);
  const selected: string[] = [];
  for (const item of chunks) {
    if (item.length < 35) continue;
    if (/^(zobacz|youtube|tiktok|najważniejsze dane|dane techniczne|specyfikacja produktu)/i.test(item)) continue;
    if (/@(polmech|trendeco)/i.test(item)) continue;
    if (selected.some(x => x.toLowerCase() === item.toLowerCase())) continue;
    selected.push(item);
    if (selected.join("\n\n").length > 850) break;
  }
  return selected.slice(0, 5);
}

function specs(p: ProductLike) {
  const preferred = /^(model|moc|zasilanie|prędkość|maksymalna|średnica|długość|szerokość|grubość|zakres|waga|wymiary|rodzaj|typ|pojemność|prędkość posuwu)/i;
  return (p.parameters ?? [])
    .filter(x => preferred.test(x.name) && x.values?.length)
    .filter(x => x.values!.some(v => !/^(0|0\.0|inna|brak informacji)$/i.test(v)))
    .slice(0, 8)
    .map(x => `${x.name}: ${x.values!.join(", ")}`);
}

export function sprzedajemyEditorial(p: ProductLike) {
  const b = brand(p);
  const technical = specs(p);
  const parts = [
    ...usefulParagraphs(p.description ?? ""),
    technical.length ? `Najważniejsze dane:\n${technical.map(x => `• ${x}`).join("\n")}` : "",
    "Produkt nowy. Sprzedaż i obsługa z Polski.",
  ].filter(Boolean);
  return {
    brand: b,
    title: cleanTitle(p.name, b),
    description: parts.join("\n\n").slice(0, 1800).trim(),
  };
}
