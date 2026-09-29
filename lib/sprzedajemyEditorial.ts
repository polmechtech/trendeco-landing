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
  return title.length <= 75 ? title : title.slice(0, 75).replace(/\s+\S*$/, "").trim();
}

function stripMarkup(text: string) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[^\\p{L}\\p{N}\\s.,;:()/%+×x–—\\-]/gu, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/
{3,}/g, "

")
    .trim();
}

function usefulParagraphs(description: string) {
  const text = stripMarkup(description);
  const chunks = text.split(/

+/).map(x => x.trim()).filter(Boolean);
  const banned = /^(zobacz|youtube|tiktok|dlaczego|bezpieczeństwo przede wszystkim|zalety stosowania|panel sterowania)$/i;
  const selected: string[] = [];
  for (const c of chunks) {
    if (banned.test(c) || /@(polmech|trendeco)/i.test(c)) continue;
    if (c.length < 35) continue;
    if (/^(najważniejsze dane|dane techniczne|specyfikacja produktu)/i.test(c)) continue;
    if (selected.some(x => x.toLowerCase() === c.toLowerCase())) continue;
    selected.push(c);
    if (selected.join("

").length > 850) break;
  }
  return selected.slice(0, 5);
}

function specs(p: ProductLike) {
  const preferred = /^(model|moc|zasilanie|prędkość|maksymalna|średnica|długość|szerokość|grubość|zakres|waga|wymiary|rodzaj|typ|pojemność|prędkość posuwu)/i;
  return (p.parameters ?? [])
    .filter(x => preferred.test(x.name) && x.values?.length && x.values.some(v => !/^(0|0\\.0|inna|brak informacji)$/i.test(v)))
    .slice(0, 8)
    .map(x => `${x.name}: ${x.values!.join(", ")}`);
}

export function sprzedajemyEditorial(p: ProductLike) {
  const b = brand(p);
  const title = cleanTitle(p.name, b);
  const intro = usefulParagraphs(p.description ?? "");
  const technical = specs(p);
  const parts = [
    ...intro,
    technical.length ? `Najważniejsze dane:
${technical.map(x => `• ${x}`).join("
")}` : "",
    "Produkt nowy. Sprzedaż i obsługa z Polski.",
  ].filter(Boolean);
  return {
    brand: b,
    title,
    description: parts.join("

").slice(0, 1800).trim(),
  };
}
