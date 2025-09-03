/// <reference types="vite/client" />
// @ts-check

export async function getBirthData() {
  const response = await fetch(
    // ohne führenden Slash – wie bei deinen anderen fetches
    import.meta.env.BASE_URL + "births_by_country_2023.json"
  );
  if (!response.ok) throw new Error("Failed to load data");

  const countries = await response.json();
  const total = countries.reduce((sum, c) => sum + (c.Births || 0), 0);

  console.log("Fetched country stats – Object", { totalBirths: total, rawLen: countries.length });
  return { totalBirths: total, raw: countries }; // << WICHTIG
}
