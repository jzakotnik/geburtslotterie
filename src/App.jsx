import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getBirthData } from "./utils/getBirthData";
import { diceRoll } from "./utils/diceRoll";
import { getGovernmentFormData } from "./utils/getGovernmentFormData";

// TopoJSON-Endpoint (funktionierend)
// world-atlas @2 liefert in geometry.id den ISO-A3-Code
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Layout = () => {
  const [allCountries, setAllCountries] = useState();
  const [allGovernments, setAllGovernments] = useState();
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Würfeln-Funktion
  const handleRoll = () => {
    if (!allCountries || allCountries.length === 0) return;
    const rolled = diceRoll(allCountries);
    // rolled.ISO_A3 zum Abgleich nutzen
    const isoCode = rolled.Country.toUpperCase();
    console.log("Rolled ISO A3:", isoCode);
    setSelectedCountry(isoCode);
  };

  useEffect(() => {
    getBirthData().then((countries) => {
      setAllCountries(countries);
    });
    getGovernmentFormData().then((countries) => {
      setAllGovernments(countries);
    });
  }, []);
  console.log(allGovernments);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          fontSize: "1.5rem",
        }}
      >
        {/* Titel */}
        <div>Geburtslotterie</div>

        {/* Würfeln-Button */}
        <button
          onClick={handleRoll}
          style={{
            marginLeft: "1rem",
            marginRight: "auto",
            backgroundColor: "#61dafb",
            color: "#1e1e1e",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Würfeln
        </button>

        {/* GitHub-Link */}
        <a
          href="https://github.com/dein-repo"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#61dafb", fontSize: "1rem" }}
        >
          GitHub
        </a>
      </header>

      <main style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div
          style={{
            flex: 2,
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            display: "flex",
            minHeight: 0,
          }}
        >
          <ComposableMap
            style={{ width: "100%", height: "100%" }}
            projectionConfig={{ scale: 150 }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // geometry.id ist hier ISO-A3
                  console.log("Available iso", selectedCountry);
                  const iso = (geo.properties.name || "").toUpperCase();

                  const isSelected = iso === selectedCountry;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: isSelected ? "#FFD700" : "#D6D6DA",
                          outline: "none",
                        },
                        hover: { fill: "#F53", outline: "none" },
                        pressed: { fill: "#E42", outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        <aside
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #2c3e50, #4f5b66)",
              color: "#ffffff",
              padding: "2rem",
              borderRadius: "0.5rem",
              width: "100%",
              boxSizing: "border-box",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            }}
          >
            <p>{selectedCountry}</p>
            <p>Placeholder line 2</p>
            <p>Placeholder line 3</p>
            <p>Placeholder line 4</p>
            <p>Placeholder line 5</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Layout;
