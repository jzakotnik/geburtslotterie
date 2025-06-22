export async function getBirthData() {
  try {
    const response = await fetch("/births_by_country_2023.json");
    if (!response.ok) throw new Error("Failed to load data");

    const countries = await response.json();
    const total = countries.reduce(
      (sum, country) => sum + (country.Births || 0),
      0
    );
    console.log("Fetched country stats", countries);

    return { totalBirths: total, raw: countries };
  } catch (error) {
    console.error("Error loading birth data:", error);
    return null;
  }
}
