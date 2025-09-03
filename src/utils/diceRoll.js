export function diceRoll(countries) {
  const list = Array.isArray(countries) ? countries : countries?.raw;
  if (!list?.length) return null;

  // Falls birthProbability fehlt, aus Births und Total schätzen
  let hasProb = true;
  for (const c of list) {
    if (typeof c.birthProbability !== "number") { hasProb = false; break; }
  }

  const totalBirths = hasProb
    ? 1
    : list.reduce((s, c) => s + (c.Births || 0), 0) || list.length;

  const r = Math.random();
  let acc = 0;

  for (const c of list) {
    const p = hasProb
      ? (c.birthProbability || 0)
      : ((c.Births || 0) / totalBirths);

    acc += p;
    if (r <= acc) return c;
  }

  return list[list.length - 1];
}
