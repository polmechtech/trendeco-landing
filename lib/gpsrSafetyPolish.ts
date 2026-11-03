/** Ogólne wskazówki w języku polskim. Szczegółowe ostrzeżenia z oferty zachowujemy poniżej bez modyfikacji. */
export function gpsrSafetyPolish(name: string, category?: string): string {
  const text = `${name} ${category ?? ""}`.toLowerCase();
  const lines = [
    "Przed rozpoczęciem użytkowania zapoznaj się z instrukcją obsługi i informacjami producenta dotyczącymi bezpieczeństwa.",
    "Używaj produktu wyłącznie zgodnie z jego przeznaczeniem. Przed pracą sprawdź stan techniczny, prawidłowy montaż i zamocowanie.",
    "Stosuj środki ochrony indywidualnej odpowiednie do rodzaju pracy. Nie używaj uszkodzonego produktu ani nie usuwaj fabrycznych zabezpieczeń.",
    "Przechowuj produkt poza zasięgiem dzieci. Montaż, regulację i konserwację wykonuj zgodnie z zaleceniami producenta."
  ];
  if (/frez|noż|nóż|ostrze|tarcza|pił|wier|wiert|głowic|wał|cnc|skraw/.test(text)) {
    lines.push("Narzędzia skrawające mają ostre krawędzie: przed wymianą lub regulacją odłącz napęd od zasilania; stosuj parametry obrotowe i mocowanie zalecane dla danego narzędzia.");
  }
  if (/elektry|230\s*v|400\s*v|silnik|wyłącznik|napęd/.test(text)) {
    lines.push("Prace przy instalacji elektrycznej powierz osobie o odpowiednich kwalifikacjach. Przed obsługą lub konserwacją odłącz zasilanie.");
  }
  return lines.join("\n\n");
}
