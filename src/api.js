// Alternative to "https://ghoapi.azureedge.net/api"
// Since frontend requests are blocked due to CORS policy

export const API_URL = "https://khianvictorycalderon.github.io/GHO-API-JSON";
export const API_DISEASE_URL = "https://disease.sh";

// DISEASES list — used by RecordPage to know what to fetch per country
export const DISEASES = [
  {
    id: "covid-19",
    name: "COVID-19",
    description: "Coronavirus disease caused by SARS-CoV-2",
    icon: "🦠",
    color: "from-rose-500 to-orange-400",
    // Per-country endpoint: append "/<countryName>" at call time
    endpoint: "/v3/covid-19/countries",
    valueKey: "cases",
    valueLabel: "Total Cases",
    extraStats: [
      { key: "deaths", label: "Deaths" },
      { key: "recovered", label: "Recovered" },
      { key: "active", label: "Active" },
      { key: "critical", label: "Critical" },
      { key: "tests", label: "Tests" },
    ],
  },
];

export default API_URL;