# 🎲 Geburtslotterie

**Geburtslotterie** ("Birth Lottery") is a React-based interactive world map app that visualizes the probability of being born in a specific country. Inspired by global population statistics, it highlights how arbitrary — and impactful — your place of birth can be.

## 🌍 Features

- 🎲 **Roll the Dice** – Simulate a random birth location based on global birth distribution probabilities.
- 🗺️ **Interactive World Map** – Highlight the selected country in real time.
- 📊 **Country Info Panel** – See average monthly income, government type, and birth probability.
- ⚖️ **Data-Driven Insight** – Based on real demographic and economic data.

## Sources
[KfW Projekte](https://www.kfw-entwicklungsbank.de/Internationale-Finanzierung/KfW-Entwicklungsbank/Projekte/Projektdatenbank/index.jsp?query=*%3A*&page=1&rows=10&sortBy=relevance&sortOrder=desc&facet.filter.language=de&dymFailover=true&groups=1)
[Birth rate](https://en.wikipedia.org/wiki/List_of_countries_by_number_of_births#cite_note-1)
[Government form](https://www.cia.gov/the-world-factbook/field/government-type/)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/geburtslotterie.git
cd geburtslotterie
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173) by default (if using Vite).

## 🛠️ Tech Stack

- **React** – Frontend framework
- **react-simple-maps** – SVG map rendering
- **Tailwind CSS / Radix UI (optional)** – UI styling
- **TopoJSON (GeoJSON)** – Country shapes and metadata

## 📦 Data Sources

- UN World Population Prospects (2024)
- World Bank & WorldData.info – Income statistics
- Wikipedia / CIA World Factbook – Government types
- GeoJSON from [Deldersveld TopoJSON repo](https://github.com/deldersveld/topojson)

## 📁 Project Structure

```
src/
├── components/
├── App.jsx
├── BirthCountryMap.jsx   # Main component with map and logic
├── data/countryData.js   # Country probabilities and metadata
```

## 📸 Screenshots

*(Include screenshots of the map before and after a roll here if desired)*

## 🧠 Inspiration

> "The chances of your being born in a specific country are not choices you make — but they deeply shape your life."  
> — Inspired by Hans Rosling's work on global inequality

## 📝 License

MIT — feel free to fork, remix, and share!

---

Made with ❤️ for thoughtful exploration.
