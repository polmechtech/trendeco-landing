import type { AllegroProduct } from "@/lib/allegro";
const normalize = (value: unknown) => String(value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
export function productSeo(product: AllegroProduct, store: string) {
  const name = normalize(product.name);
  const category = normalize(product.category);
  const rawDescription = normalize(product.description);
  const sentence = rawDescription ? rawDescription.slice(0, 155) : [name, category, "Sprawdź aktualne dane techniczne i dostępność produktu."].filter(Boolean).join(". ").slice(0, 155);
  const title = (name.length > 57 ? name.slice(0, 54).trimEnd() + "…" : name) + " | " + store;
  return { title, description: sentence, keywords: [name, category].filter(Boolean) };
}
