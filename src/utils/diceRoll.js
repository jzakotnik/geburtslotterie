export function diceRoll(countries) {
  console.log("Rolling dice on ", countries.raw);
  const r = Math.random();
  let sum = 0;

  for (const country of countries.raw) {
    sum += country.birthProbability;
    if (r <= sum) {
      return country;
    }
  }

  // Fallback (in case of floating point errors)
  return countries[countries.length - 1];
}
