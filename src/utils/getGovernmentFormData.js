/// <reference types="vite/client" />
// @ts-check

export async function getGovernmentFormData() {
  try {
    const response = await fetch(
      import.meta.env.BASE_URL + "/government_forms.json"
    );
    if (!response.ok) throw new Error("Failed to load data");

    const countries = await response.json();

    console.log("Fetched country stats", countries);

    return countries;
  } catch (error) {
    console.error("Error loading birth data:", error);
    return null;
  }
}
