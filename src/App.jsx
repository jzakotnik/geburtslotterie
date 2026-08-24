import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getBirthData } from "./utils/getBirthData";
import { diceRoll } from "./utils/diceRoll";
import { getGovernmentFormData } from "./utils/getGovernmentFormData";
import Projects from "./components/Projects";
import StyledButton from "./components/StyledButton";
import ThemeToggle from "./components/ThemeToggle";
import ActionsMenu from "./components/ActionsMenu";

const Layout = () => {
  // Daten
  const [allCountries, setAllCountries] = useState(null); // { totalBirths, raw: [] }
  const [allGovernments, setAllGovernments] = useState(null);
  const [allChildMortality, setAllChildMortality] = useState(null);
  const [allIncomes, setAllIncomes] = useState(null);
  const [geoData, setGeoData] = useState(null);

  // Auswahl fürs rechte (jetzt: untere) Panel – nur durch Button
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(0);
  const [selectedChildMortality, setSelectedChildMortality] = useState(0);

  // Klick-Pop-up (ändert Panel NICHT)
  const [preview, setPreview] = useState(null); // { x,y,name,iso,gov,incomePct,mortalityX }
  const popRef = useRef(null);

  // Daten laden
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "countries110m.json")
      .then((r) => r.json())
      .then(setGeoData)
      .catch(console.error);

    fetch(import.meta.env.BASE_URL + "child_mortality_with_iso.json")
      .then((r) => r.json())
      .then(setAllChildMortality)
      .catch(console.error);

    fetch(import.meta.env.BASE_URL + "income.json")
      .then((r) => r.json())
      .then(setAllIncomes)
      .catch(console.error);

    getBirthData().then(setAllCountries).catch(console.error);
    getGovernmentFormData().then(setAllGovernments).catch(console.error);
  }, []);

  // Helfer für Kennzahlen
  const incomePctFor = (iso) => {
    if (!allIncomes?.length) return null;
    const fi = allIncomes.find((i) => i.iso_a3 === iso);
    const gi = allIncomes.find((i) => i.iso_a3 === "DEU");
    return fi && gi ? Math.round((fi.income / gi.income) * 100) : null;
  };
  const mortalityXFor = (iso) => {
    if (!allChildMortality?.length) return null;
    const f = allChildMortality.find((i) => i.iso_a3 === iso);
    const g = allChildMortality.find((i) => i.iso_a3 === "DEU");
    return f && g ? Math.round(f.child_mortality_percent / g.child_mortality_percent) : null;
  };

  // Würfeln (setzt NUR Panel)
  const handleRoll = async () => {
    if (!allCountries?.raw?.length) return;
    const rolled = diceRoll(allCountries); // erwartet Objekt mit .raw
    setSelectedCountry(rolled);

    // Permalink ?c=ISO
    const url = new URL(window.location.href);
    url.searchParams.set("c", rolled.ISO_A3);
    window.history.replaceState({}, "", url);

    // Confetti (optional)
    try {
      const { default: confetti } = await import("canvas-confetti");
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.2 } });
    } catch {}
  };

  // Panel-Kennzahlen berechnen
  useEffect(() => {
    if (!selectedCountry) return;
    setSelectedIncome(incomePctFor(selectedCountry.ISO_A3) ?? 0);
    setSelectedChildMortality(mortalityXFor(selectedCountry.ISO_A3) ?? 0);
  }, [selectedCountry, allIncomes, allChildMortality]);

  // URL ?c=ISO beim Laden respektieren
  useEffect(() => {
    const iso = new URLSearchParams(window.location.search).get("c");
    if (!iso || !allCountries?.raw?.length) return;
    const c = allCountries.raw.find((x) => x.ISO_A3 === iso);
    if (c) setSelectedCountry(c);
  }, [allCountries]);

  // Popover outside-click / ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (!preview) return;
      if (popRef.current && !popRef.current.contains(e.target)) setPreview(null);
    };
    const onEsc = (e) => e.key === "Escape" && setPreview(null);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [preview]);

  // Popover an den sichtbaren Viewport klemmen, damit sie nie am Rand
  // (z.B. rechter/unterer Bildschirmrand, kleine Handys) abgeschnitten wird.
  useLayoutEffect(() => {
    if (!preview || !popRef.current) return;
    const el = popRef.current;
    const margin = 8;

    // Erstmal an der gewünschten Klick-Position rendern, damit wir die
    // tatsächliche Größe der Popover messen können.
    el.style.left = `${preview.x}px`;
    el.style.top = `${preview.y}px`;

    const rect = el.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;

    const clampedX = Math.min(Math.max(preview.x, margin), Math.max(margin, maxX));
    const clampedY = Math.min(Math.max(preview.y, margin), Math.max(margin, maxY));

    el.style.left = `${clampedX}px`;
    el.style.top = `${clampedY}px`;
  }, [preview]);

  // Map-Klick → Pop-up füllen (Panel bleibt unberührt)
  const handleCountryClick = (e, geo) => {
    e.stopPropagation(); // verhindert sofortiges Schließen
    const name = (geo.properties.name || "").toUpperCase();

    const entry =
      allCountries?.raw?.find((c) => (c.Country || "").toUpperCase() === name) || null;

    const iso = entry?.ISO_A3 || geo.properties.iso_a3 || "";
    const gov = iso ? allGovernments?.[iso]?.government_form_de : null;

    setPreview({
      x: e.clientX + 12,
      y: e.clientY + 12,
      name: entry?.Country_de || entry?.Country || geo.properties.name,
      iso,
      gov: gov || "—",
      incomePct: iso ? incomePctFor(iso) : null,
      mortalityX: iso ? mortalityXFor(iso) : null,
    });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden>🎲</div>
          <div>
            <div className="title">Geburtslotterie</div>
            <div className="subtitle">wo lande ich im nächsten Leben?</div>
          </div>
        </div>
        <div className="header-right">
          <StyledButton onClick={handleRoll}>Nächstes Leben..</StyledButton>
          <ThemeToggle />
          <ActionsMenu onHelp={() => alert("Hier könnte dein Hilfe-Dialog aufgehen 😊")} />
        </div>
      </header>

      {/* Main – jetzt einspaltig, zentriert durch CSS */}
      <main className="main">
        {/* Map */}
        <section className="mapWrap" aria-label="Weltkarte">
          {geoData ? (
            <ComposableMap viewBox="0 0 800 450" style={{ width: "100%", display: "block" }}>
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = (geo.properties.name || "").toUpperCase();
                    const isSelected = name === selectedCountry?.Country?.toUpperCase();
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className="map-country"
                        onClick={(e) => handleCountryClick(e, geo)}
                        style={{
                          /* Ausgewähltes Land folgt jetzt --primary, passt sich
                             also automatisch an Light/Dark-Theme an, statt
                             einen festen Hex-Wert zu benutzen. */
                          default: { fill: isSelected ? "var(--primary)" : "#bfc7d1", outline: "none", stroke: "#8aa" },
                          hover:   { fill: isSelected ? "var(--primary)" : "#d6dde6", outline: "none" },
                          pressed: { fill: "color-mix(in oklab, var(--primary), white 30%)", outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          ) : (
            <div className="skel" style={{ height: 420 }} />
          )}

          {/* Pop-up */}
          {preview && (
            <div
              ref={popRef}
              className="popover"
              style={{ left: preview.x, top: preview.y }}
              role="dialog"
              aria-label={`Infos zu ${preview.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popover-head">
                <strong>{preview.name}</strong>
                <span className="muted">{preview.iso || "—"}</span>
              </div>

              <div className="popover-row">
                <span className="muted">Staatsform</span>
                <span>{preview.gov}</span>
              </div>
              <div className="popover-row">
                <span className="muted">Gehalt vs. DE</span>
                <span>{preview.incomePct != null ? `${preview.incomePct}%` : "—"}</span>
              </div>
              <div className="popover-row">
                <span className="muted">Sterberisiko</span>
                <span>{preview.mortalityX != null ? `x${preview.mortalityX}` : "—"}</span>
              </div>

              <div className="popover-actions">
                <button className="btn" onClick={() => setPreview(null)}>Schließen</button>
              </div>
            </div>
          )}
        </section>

        {/* Panel (Zufallsinfo) – gleiche Breite, darunter */}
        <aside className="panel" aria-live="polite">
          {selectedCountry ? (
            <>
              <h3>🎉 Glückwunsch, es ist: {selectedCountry.Country_de}</h3>
              <p className="muted">
                Staatsform: {allGovernments?.[selectedCountry.ISO_A3]?.government_form_de ?? "—"}
              </p>

              <div className="stats">
                <div className="stat">
                  <div className="label">Gehalt vs. DE</div>
                  <div className="value">{selectedIncome ? `${selectedIncome}%` : "—"}</div>
                  <div className="meter" aria-hidden>
                    <i style={{ width: `${Math.min(selectedIncome, 100)}%` }} />
                  </div>
                </div>
                <div className="stat">
                  <div className="label">Sterberisiko bei Geburt</div>
                  <div className="value">{selectedChildMortality ? `x${selectedChildMortality}` : "—"}</div>
                  <div className="meter" aria-hidden>
                    <i style={{ width: `${Math.min(selectedChildMortality * 4, 100)}%` }} />
                  </div>
                </div>
              </div>

              <Projects iso_a3={selectedCountry.ISO_A3} />
            </>
          ) : (
            <p className="muted">Klick auf <strong>„Nächstes Leben..“</strong>, um zu würfeln.</p>
          )}
        </aside>
      </main>
    </div>
  );
};

export default Layout;
