import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import API_URL from "../api";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const CYAN    = "#06b6d4";
const TEAL    = "#14b8a6";
const INDIGO  = "#6366f1";
const EMERALD = "#10b981";
const ROSE    = "#f43f5e";
const REGION_PALETTE = [CYAN, TEAL, "#0ea5e9", INDIGO, "#f59e0b", EMERALD, ROSE, "#8b5cf6"];

// ── useFetch ──────────────────────────────────────────────────────────────────
function useFetch(indicator) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  useEffect(() => {
    fetch(`${API_URL}/api/${indicator}.json`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((j) => setState({ data: j.value || [], loading: false, error: null }))
      .catch((e) => setState({ data: [], loading: false, error: e.message }));
  }, [indicator]);
  return state;
}

// ── groupAvg: group by keyFn, return avg NumericValue per key ─────────────────
function groupAvg(rows, keyFn) {
  const map = {};
  rows.forEach((d) => {
    const k = String(keyFn(d));
    if (!map[k]) map[k] = [];
    map[k].push(d.NumericValue);
  });
  return Object.entries(map).map(([key, vals]) => ({
    key,
    avg: +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2),
    count: vals.length,
  }));
}

// ── baseOptions ───────────────────────────────────────────────────────────────
const baseOptions = (hasScales = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#64748b", font: { size: 10 }, padding: 10, boxWidth: 10 },
    },
    tooltip: { enabled: true },
  },
  ...(hasScales ? {
    scales: {
      x: { ticks: { color: "#64748b", font: { size: 10 } }, grid: { display: false } },
      y: { ticks: { color: "#64748b", font: { size: 10 } }, grid: { color: "rgba(100,116,139,0.1)" } },
    },
  } : {}),
});

// ── ChartCard ─────────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, loading, error, children }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-800 leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 p-4 min-h-[240px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-7 h-7 rounded-full border-[3px] border-cyan-100 border-t-cyan-500 animate-spin" />
            <p className="text-xs text-neutral-400">Loading data…</p>
          </div>
        ) : error ? (
          <p className="text-xs text-red-400">Failed: {error}</p>
        ) : (
          <div className="w-full h-[240px]">{children}</div>
        )}
      </div>
    </div>
  );
}

// ── StatPill ──────────────────────────────────────────────────────────────────
function StatPill({ label, value, accent }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-neutral-200 shadow-sm px-4 py-4 text-center">
      <span className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-xs text-neutral-500 mt-1 leading-tight">{label}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Statistics() {

  // 1. NCD_BMI_25C  — Overweight prevalence (BMI ≥ 25), Dim1: SEX_FMLE / SEX_MLE
  const bmi      = useFetch("NCD_BMI_25C");
  // 2. WHOSIS_000003 — Neonatal mortality rate (0–27 days), Dim1: SEX_BTSX
  const neonatal = useFetch("WHOSIS_000003");
  // 3. NCD_GLUC_04  — Raised fasting blood glucose, Dim1: SEX_BTSX (fallback avg M+F)
  const glucose  = useFetch("NCD_GLUC_04");
  // 4. AIR_5        — Ambient air pollution mortality, SpatialDimType: REGION, Dim1: SEX_BTSX
  const air      = useFetch("AIR_5");

  // ── 1. BMI: avg male+female per country, latest year, top 10 ─────────────────
  const bmiChart = (() => {
    if (!bmi.data.length) return null;
    const rows = bmi.data.filter(
      (d) => d.NumericValue != null &&
             d.SpatialDimType === "COUNTRY" &&
             (d.Dim1 === "SEX_FMLE" || d.Dim1 === "SEX_MLE")
    );
    if (!rows.length) return null;
    const latest = Math.max(...rows.map((d) => d.TimeDim));
    const atLatest = rows.filter((d) => d.TimeDim === latest);
    const byCountry = groupAvg(atLatest, (d) => d.SpatialDim)
      .sort((a, b) => b.avg - a.avg).slice(0, 10);
    const globalAvg = +(atLatest.reduce((s, d) => s + d.NumericValue, 0) / atLatest.length).toFixed(1);
    const countryCount = new Set(atLatest.map((d) => d.SpatialDim)).size;
    return { year: latest, labels: byCountry.map((d) => d.key), values: byCountry.map((d) => d.avg), globalAvg, countryCount };
  })();

  // ── 2. Neonatal: SEX_BTSX, avg all countries per year → trend line ────────────
  const neonatalChart = (() => {
    if (!neonatal.data.length) return null;
    const rows = neonatal.data.filter(
      (d) => d.NumericValue != null &&
             d.SpatialDimType === "COUNTRY" &&
             d.Dim1 === "SEX_BTSX"
    );
    if (!rows.length) return null;
    const byYear = groupAvg(rows, (d) => d.TimeDim)
      .sort((a, b) => Number(a.key) - Number(b.key));
    const latest = byYear.at(-1);
    const oldest = byYear[0];
    const change = (latest && oldest) ? +(latest.avg - oldest.avg).toFixed(1) : null;
    return {
      labels: byYear.map((d) => d.key),
      values: byYear.map((d) => d.avg),
      latestAvg: latest?.avg,
      latestYear: latest?.key,
      oldestYear: oldest?.key,
      change,
    };
  })();

  // ── 3. Glucose: prefer SEX_BTSX; fallback avg SEX_MLE+SEX_FMLE; top 10 ───────
  const glucoseChart = (() => {
    if (!glucose.data.length) return null;
    const btsx = glucose.data.filter(
      (d) => d.NumericValue != null && d.SpatialDimType === "COUNTRY" && d.Dim1 === "SEX_BTSX"
    );
    const usedRows = btsx.length > 0 ? btsx : glucose.data.filter(
      (d) => d.NumericValue != null && d.SpatialDimType === "COUNTRY" &&
             (d.Dim1 === "SEX_MLE" || d.Dim1 === "SEX_FMLE")
    );
    if (!usedRows.length) return null;
    const latest = Math.max(...usedRows.map((d) => d.TimeDim));
    const atLatest = usedRows.filter((d) => d.TimeDim === latest);
    const byCountry = groupAvg(atLatest, (d) => d.SpatialDim)
      .sort((a, b) => b.avg - a.avg).slice(0, 10);
    const globalAvg = +(atLatest.reduce((s, d) => s + d.NumericValue, 0) / atLatest.length).toFixed(1);
    return { year: latest, labels: byCountry.map((d) => d.key), values: byCountry.map((d) => d.avg), globalAvg };
  })();

  // ── 4. Air: REGION + SEX_BTSX + latest year, sum all age group sub-rows ───────
  const airChart = (() => {
    if (!air.data.length) return null;
    const rows = air.data.filter(
      (d) => d.NumericValue != null &&
             d.SpatialDimType === "REGION" &&
             d.Dim1 === "SEX_BTSX"
    );
    if (!rows.length) return null;
    const latest = Math.max(...rows.map((d) => d.TimeDim));
    const atLatest = rows.filter((d) => d.TimeDim === latest);
    // Sum across all Dim2 (age group) sub-rows per region
    const sumMap = {};
    atLatest.forEach((d) => {
      sumMap[d.SpatialDim] = (sumMap[d.SpatialDim] || 0) + d.NumericValue;
    });
    const regions = Object.entries(sumMap)
      .map(([key, val]) => ({ key, val: +val.toFixed(2) }))
      .sort((a, b) => b.val - a.val);
    return { year: latest, labels: regions.map((r) => r.key), values: regions.map((r) => r.val) };
  })();

  // ── Pills derived values ──────────────────────────────────────────────────────
  const changeAccent = neonatalChart?.change < 0 ? EMERALD : ROSE;

  return (
    <section className="bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-cyan-500 text-xs font-mono uppercase tracking-[3px] mb-2">
            WHO · Live Data
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Global Health Statistics
          </h2>
          <p className="text-neutral-500 text-sm mt-2 max-w-xl">
            Real-time data from the WHO Global Health Observatory across four key indicators.
          </p>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatPill
            label={`Avg. Overweight Rate · ${bmiChart?.year ?? "…"} · ${bmiChart?.countryCount ?? "…"} countries`}
            value={bmiChart ? `${bmiChart.globalAvg}%` : "…"}
            accent={CYAN}
          />
          <StatPill
            label={`Avg. Neonatal Mortality · ${neonatalChart?.latestYear ?? "…"} (per 1,000 births)`}
            value={neonatalChart ? `${neonatalChart.latestAvg}` : "…"}
            accent={TEAL}
          />
          <StatPill
            label={`Neonatal Mortality Change · ${neonatalChart?.oldestYear ?? "…"}→${neonatalChart?.latestYear ?? "…"}`}
            value={neonatalChart?.change != null ? `${neonatalChart.change > 0 ? "+" : ""}${neonatalChart.change}` : "…"}
            accent={changeAccent}
          />
          <StatPill
            label={`Avg. Raised Blood Glucose · ${glucoseChart?.year ?? "…"}`}
            value={glucoseChart ? `${glucoseChart.globalAvg}%` : "…"}
            accent={INDIGO}
          />
        </div>

        {/* Charts 2×2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* 1. BMI Bar */}
          <ChartCard
            title="Overweight Prevalence (BMI ≥ 25)"
            subtitle={bmiChart ? `Top 10 countries · ${bmiChart.year} · avg of male & female (%)` : "Loading…"}
            loading={bmi.loading}
            error={bmi.error}
          >
            {bmiChart && (
              <Bar
                data={{
                  labels: bmiChart.labels,
                  datasets: [{
                    label: "Prevalence (%)",
                    data: bmiChart.values,
                    backgroundColor: bmiChart.labels.map((_, i) => `hsl(${185 + i * 7}, 68%, ${54 - i * 2}%)`),
                    borderRadius: 6,
                  }],
                }}
                options={baseOptions()}
              />
            )}
          </ChartCard>

          {/* 2. Neonatal Mortality Line */}
          <ChartCard
            title="Neonatal Mortality Rate (0–27 days)"
            subtitle="Global country avg per year · SEX_BTSX · per 1,000 live births"
            loading={neonatal.loading}
            error={neonatal.error}
          >
            {neonatalChart && (
              <Line
                data={{
                  labels: neonatalChart.labels,
                  datasets: [{
                    label: "Avg. Neonatal Mortality (per 1,000)",
                    data: neonatalChart.values,
                    borderColor: TEAL,
                    backgroundColor: "rgba(20,184,166,0.1)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: TEAL,
                    pointRadius: 2,
                  }],
                }}
                options={baseOptions()}
              />
            )}
          </ChartCard>

          {/* 3. Glucose Bar */}
          <ChartCard
            title="Raised Fasting Blood Glucose (Diabetes Risk)"
            subtitle={glucoseChart ? `Top 10 countries · ${glucoseChart.year} · SEX_BTSX (%)` : "Loading…"}
            loading={glucose.loading}
            error={glucose.error}
          >
            {glucoseChart && (
              <Bar
                data={{
                  labels: glucoseChart.labels,
                  datasets: [{
                    label: "Prevalence (%)",
                    data: glucoseChart.values,
                    backgroundColor: glucoseChart.labels.map((_, i) => `hsl(${250 + i * 6}, 65%, ${58 - i * 2}%)`),
                    borderRadius: 6,
                  }],
                }}
                options={baseOptions()}
              />
            )}
          </ChartCard>

          {/* 4. Air Pollution Doughnut */}
          <ChartCard
            title="Ambient Air Pollution Mortality"
            subtitle={airChart ? `By WHO region · ${airChart.year} · SEX_BTSX · summed across age groups` : "Loading…"}
            loading={air.loading}
            error={air.error}
          >
            {airChart && (
              <Doughnut
                data={{
                  labels: airChart.labels,
                  datasets: [{
                    label: "Mortality rate (summed)",
                    data: airChart.values,
                    backgroundColor: REGION_PALETTE.slice(0, airChart.labels.length),
                    borderWidth: 0,
                    cutout: "62%",
                  }],
                }}
                options={baseOptions(false)}
              />
            )}
          </ChartCard>

        </div>

        {/* Source note */}
        <p className="text-center text-xs text-neutral-400 mt-8">
          Data sourced from the{" "}
          <a href="https://www.who.int/data/gho" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
            WHO Global Health Observatory
          </a>
          {" "}· Indicators: NCD_BMI_25C · WHOSIS_000003 · NCD_GLUC_04 · AIR_5
        </p>
      </div>
    </section>
  );
}