import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getBirthData } from "./utils/getBirthData";
import { diceRoll } from "./utils/diceRoll";
import { getGovernmentFormData } from "./utils/getGovernmentFormData";
import Projects from "./components/Projects";

const Layout = () => {
  const [allCountries, setAllCountries] = useState();
  const [allGovernments, setAllGovernments] = useState();
  const [allIncomes, setAllIncomes] = useState();
  const [geoData, setGeoData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle viewport resize to toggle mobile layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRoll = () => {
    if (!allCountries || allCountries.length === 0) return;
    const rolled = diceRoll(allCountries);
    setSelectedCountry(rolled);
    const filteredIncome = allIncomes.find((i) => i.iso_a3 === rolled.ISO_A3);
    const germanyIncome = allIncomes.find((i) => i.iso_a3 === "DEU");

    console.log(
      "Calculating incomes for ",
      rolled,
      filteredIncome,
      germanyIncome
    );
    setSelectedIncome(
      Math.round((filteredIncome.income / germanyIncome.income) * 100)
    );
  };

  useEffect(() => {
    fetch("/countries110m.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load local topojson");
        return res.json();
      })
      .then((topoJson) => setGeoData(topoJson))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("/income.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load incomes");
        return res.json();
      })
      .then((incomes) => setAllIncomes(incomes))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    getBirthData().then((countries) => setAllCountries(countries));
    getGovernmentFormData().then((countries) => setAllGovernments(countries));
  }, []);

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
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          fontSize: "1.5rem",
        }}
      >
        <div style={{ marginBottom: isMobile ? "0.5rem" : 0 }}>
          <strong>Geburtslotterie</strong> - wo lande ich im nächsten Leben?
        </div>
        <button
          onClick={handleRoll}
          style={{
            backgroundColor: "#61dafb",
            color: "#1e1e1e",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            cursor: "pointer",
            fontSize: "1rem",
            marginBottom: isMobile ? "0.5rem" : 0,
          }}
        >
          Würfeln
        </button>
        <a
          href="https://github.com/jzakotnik"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#61dafb", fontSize: "1rem" }}
        >
          GitHub
        </a>
      </header>

      <main
        style={{
          display: "flex",
          flex: 1,
          flexDirection: isMobile ? "column" : "row",
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: 2,
            padding: "1rem",
            backgroundImage:
              "linear-gradient(to bottom, #002a00 0%, #001200 50%, #00002d 100%)",
            minHeight: 0,
            width: isMobile ? "100%" : "auto",
            height: isMobile ? "50vh" : "100%",
          }}
        >
          <ComposableMap
            style={{ width: "100%", height: "100%" }}
            projectionConfig={{ scale: 150 }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const iso = (geo.properties.name || "").toUpperCase();
                  const isSelected =
                    iso === selectedCountry?.Country.toUpperCase();
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: isSelected ? "#0F37F0" : "#D6D6DA",
                          outline: "none",
                          stroke: "#888888",
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
            width: isMobile ? "100%" : "auto",
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
            {selectedCountry ? (
              <div>
                <p>
                  🎉🎉🎉 Glückwunsch, es ist:{" "}
                  <strong>{selectedCountry?.Country_de}</strong>
                </p>
                <p>
                  Staatsform:{" "}
                  {allGovernments[selectedCountry.ISO_A3]?.government_form_de}
                </p>
                <p>
                  Durchschnittsgehalt: <strong>{selectedIncome} %</strong> vom
                  Gehalt in Deutschland
                </p>

                <Projects iso_a3={selectedCountry.ISO_A3} />
              </div>
            ) : null}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Layout;
