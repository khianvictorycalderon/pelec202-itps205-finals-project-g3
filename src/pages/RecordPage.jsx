import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { slideToTop } from "../utils";
import { API_DISEASE_URL, DISEASES } from "../api";
import HeatMap from "../components/HeatMap";

function fmt(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString();
}

function fmtPct(n) {
  if (n == null) return "—";
  return `${Number(n).toFixed(2)}%`;
}

// Stat card color palettes by index
const STAT_STYLES = [
  { color: "text-sky-700", bg: "bg-sky-50 border-sky-100" },
  { color: "text-red-600", bg: "bg-red-50 border-red-100" },
  { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  { color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  { color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  { color: "text-pink-600", bg: "bg-pink-50 border-pink-100" },
];

function RecordPage() {
  // The :id param is the encoded country name
  const { id } = useParams();
  const countryName = decodeURIComponent(id);

  const [countryData, setCountryData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    slideToTop();
    setLoading(true);
    setError(null);

    // Fetch both: the specific country + all countries (for the heatmap context)
    Promise.all([
      fetch(`${API_DISEASE_URL}/v3/covid-19/countries/${encodeURIComponent(countryName)}`).then(
        (r) => {
          if (!r.ok) throw new Error(`Country not found (HTTP ${r.status})`);
          return r.json();
        }
      ),
      fetch(`${API_DISEASE_URL}/v3/covid-19/countries?sort=cases`).then((r) =>
        r.json()
      ),
    ])
      .then(([country, all]) => {
        setCountryData(country);
        setAllData(Array.isArray(all) ? all : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [countryName]);

  // Build heatmap points — all countries, but highlight the selected one
  const heatPoints = useMemo(() => {
    return allData
      .filter(
        (c) =>
          c.countryInfo?.lat != null &&
          c.countryInfo?.long != null &&
          (c.cases ?? 0) > 0
      )
      .map((c) => ({
        lat: c.countryInfo.lat,
        lng: c.countryInfo.long,
        intensity: c.cases ?? 0,
        country: c.country,
        isSelected: c.country === countryName,
      }));
  }, [allData, countryName]);

  // Map center: zoom into selected country
  const mapCenter = useMemo(() => {
    if (!countryData?.countryInfo) return null;
    return {
      lat: countryData.countryInfo.lat,
      lng: countryData.countryInfo.long,
    };
  }, [countryData]);

  // Top 5 countries for the bar chart comparison
  const top5 = useMemo(() => {
    return [...allData]
      .sort((a, b) => (b.cases ?? 0) - (a.cases ?? 0))
      .slice(0, 5);
  }, [allData]);

  // Determine rank of this country
  const countryRank = useMemo(() => {
    const sorted = [...allData].sort((a, b) => (b.cases ?? 0) - (a.cases ?? 0));
    const idx = sorted.findIndex((c) => c.country === countryName);
    return idx === -1 ? null : idx + 1;
  }, [allData, countryName]);

  const disease = DISEASES[0]; // Currently only COVID-19

  // All stats to display
  const allStats = useMemo(() => {
    if (!countryData) return [];
    return [
      { key: "cases", label: "Total Cases" },
      { key: "deaths", label: "Deaths" },
      { key: "recovered", label: "Recovered" },
      { key: "active", label: "Active" },
      { key: "critical", label: "Critical" },
      { key: "tests", label: "Total Tests" },
      { key: "todayCases", label: "Today's Cases" },
      { key: "todayDeaths", label: "Today's Deaths" },
      { key: "todayRecovered", label: "Today's Recovered" },
    ].map((s, i) => ({
      ...s,
      value: countryData[s.key],
      ...STAT_STYLES[i % STAT_STYLES.length],
    }));
  }, [countryData]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* ── Hero ── */}
      <div className="bg-sky-900 pt-24 pb-10 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#67e8f9 1px,transparent 1px),linear-gradient(to bottom,#67e8f9 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-200 text-sm transition mb-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Countries
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Flag */}
              {countryData?.countryInfo?.flag && (
                <img
                  src={countryData.countryInfo.flag}
                  alt={countryName}
                  className="w-16 h-11 object-cover rounded-lg shadow-md shrink-0"
                />
              )}
              <div>
                <p className="text-cyan-400 text-xs font-mono uppercase tracking-[3px] mb-1">
                  {disease.icon} {disease.name} · Country Report
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {countryName}
                </h1>
                {countryRank && (
                  <p className="text-sky-300/70 text-sm mt-1">
                    Ranked <span className="text-cyan-300 font-semibold">#{countryRank}</span> globally by total cases
                  </p>
                )}
              </div>
            </div>

            {/* Quick hero stats */}
            {!loading && !error && countryData && (
              <div className="flex flex-wrap gap-5 shrink-0">
                {[
                  { label: "Cases", value: countryData.cases },
                  { label: "Deaths", value: countryData.deaths },
                  { label: "Recovered", value: countryData.recovered },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
                      {s.label}
                    </p>
                    <p className="text-white text-xl font-bold">{fmt(s.value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 pb-16 flex flex-col gap-6">

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center py-20 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-neutral-600 font-medium">Failed to load data</p>
            <p className="text-neutral-400 text-sm font-mono">{error}</p>
            <Link
              to="/browse"
              className="mt-2 text-sm text-cyan-600 hover:text-cyan-800 transition"
            >
              ← Back to countries
            </Link>
          </div>
        )}

        {/* ── Heatmap — centred on this country ── */}
        {!error && (
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-700">
                  Global Heatmap — COVID-19 Cases
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Map is centred on {countryName}. Intensity reflects total cases per country.
                </p>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
                <span>Low</span>
                <div
                  className="w-20 h-3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right,#00bcd4,#ffeb3b,#f44336)",
                  }}
                />
                <span>High</span>
              </div>
            </div>
            {/* Pass center so HeatMap can zoom in — see note below */}
            <HeatMap
              points={heatPoints}
              loading={loading}
              center={mapCenter}
              zoom={mapCenter ? 4 : 2}
            />
          </div>
        )}

        {/* ── Full stats grid ── */}
        {!loading && !error && countryData && (
          <div>
            <h2 className="text-sm font-semibold text-neutral-700 mb-3">
              Disease Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allStats.map((stat) => (
                <div
                  key={stat.key}
                  className={`rounded-2xl border p-4 ${stat.bg}`}
                >
                  <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {fmt(stat.value)}
                  </p>
                </div>
              ))}

              {/* Derived: case fatality rate */}
              {countryData.cases > 0 && (
                <div className="rounded-2xl border p-4 bg-neutral-50 border-neutral-100">
                  <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1">
                    Fatality Rate
                  </p>
                  <p className="text-2xl font-bold text-neutral-700">
                    {fmtPct((countryData.deaths / countryData.cases) * 100)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Per-million stats ── */}
        {!loading && !error && countryData && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-neutral-700 mb-4">
              Per Million Population
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { key: "casesPerOneMillion", label: "Cases / 1M" },
                { key: "deathsPerOneMillion", label: "Deaths / 1M" },
                { key: "testsPerOneMillion", label: "Tests / 1M" },
                { key: "activePerOneMillion", label: "Active / 1M" },
              ].map((s) => (
                <div key={s.key} className="text-center">
                  <p className="text-xs text-neutral-400 mb-1">{s.label}</p>
                  <p className="text-lg font-bold text-neutral-800">
                    {fmt(countryData[s.key])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Country metadata ── */}
        {!loading && !error && countryData && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-neutral-700 mb-4">
              Country Metadata
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                { label: "Population", value: fmt(countryData.population) },
                {
                  label: "Continent",
                  value: countryData.continent || "—",
                },
                {
                  label: "ISO2",
                  value: countryData.countryInfo?.iso2 || "—",
                },
                {
                  label: "ISO3",
                  value: countryData.countryInfo?.iso3 || "—",
                },
                {
                  label: "Latitude",
                  value: countryData.countryInfo?.lat?.toFixed(4) || "—",
                },
                {
                  label: "Longitude",
                  value: countryData.countryInfo?.long?.toFixed(4) || "—",
                },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest mb-0.5">
                    {m.label}
                  </p>
                  <p className="font-semibold text-neutral-800">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Top 5 comparison bar chart ── */}
        {!loading && !error && top5.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-5">
            <h2 className="text-sm font-semibold text-neutral-700 mb-4">
              Top 5 Countries — Total Cases (for context)
            </h2>
            <div className="flex flex-col gap-3">
              {top5.map((c, i) => {
                const val = c.cases ?? 0;
                const maxVal = top5[0].cases ?? 1;
                const pct = Math.round((val / maxVal) * 100);
                const isThis = c.country === countryName;
                return (
                  <div key={c.country} className="flex items-center gap-4">
                    <span className="w-6 text-xs font-mono text-neutral-400 shrink-0 text-right">
                      #{i + 1}
                    </span>
                    <div className="w-36 shrink-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isThis ? "text-cyan-700 font-bold" : "text-neutral-800"
                        }`}
                      >
                        {c.country} {isThis && "◀"}
                      </p>
                    </div>
                    <div className="flex-1 bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isThis
                            ? "bg-gradient-to-r from-cyan-400 to-cyan-600"
                            : "bg-gradient-to-r from-cyan-500 to-sky-700"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-neutral-700 tabular-nums w-28 text-right shrink-0">
                      {fmt(val)}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Show selected country if it's not in top 5 */}
            {countryRank && countryRank > 5 && countryData && (
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-4">
                <span className="w-6 text-xs font-mono text-cyan-500 shrink-0 text-right font-bold">
                  #{countryRank}
                </span>
                <div className="w-36 shrink-0">
                  <p className="text-sm font-bold text-cyan-700 truncate">
                    {countryName} ◀
                  </p>
                </div>
                <div className="flex-1 bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-700"
                    style={{
                      width: `${Math.max(
                        1,
                        Math.round(
                          ((countryData.cases ?? 0) / (top5[0]?.cases ?? 1)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-neutral-700 tabular-nums w-28 text-right shrink-0">
                  {fmt(countryData.cases)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Last updated */}
        {!loading && !error && countryData?.updated && (
          <p className="text-xs text-neutral-400 text-center">
            Data last updated:{" "}
            {new Date(countryData.updated).toLocaleString()}. Source: disease.sh
          </p>
        )}
      </div>
    </div>
  );
}

export default RecordPage;