import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { slideToTop } from "../utils";
import { API_DISEASE_URL } from "../api";

const ITEMS_PER_PAGE = 18;
const MAX_PAGES = 10;

function BrowsePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    slideToTop();
    // Fetch all countries with COVID stats — gives us a rich country list
    fetch(`${API_DISEASE_URL}/v3/covid-19/countries?sort=cases`)
      .then((res) => res.json())
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Keyboard shortcut: "/" focuses the search input
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        document.querySelector("input[type='text']")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.country.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const totalPages = Math.min(
    MAX_PAGES,
    Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE))
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Encode country name for URL (some names have spaces/special chars)
  const encodeCountry = (name) => encodeURIComponent(name);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* ── Hero ── */}
      <div className="relative bg-sky-900 overflow-hidden">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #67e8f9 1px, transparent 1px), linear-gradient(to bottom, #67e8f9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-cyan-400 text-xs font-mono uppercase tracking-[3px] mb-2">
                Disease · Global Health Data
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Covide Cases in Countries
              </h1>
              <p className="text-sky-300/70 text-sm mt-2 max-w-md">
                Select a country to explore disease statistics, heatmaps, and
                health metadata.
              </p>
            </div>

            {/* Stats */}
            {!loading && (
              <div className="flex gap-6 shrink-0">
                <div className="text-center">
                  <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
                    Total
                  </p>
                  <p className="text-white text-2xl font-bold">
                    {data.length.toLocaleString()}
                  </p>
                </div>
                <div className="w-px bg-cyan-300/20" />
                <div className="text-center">
                  <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
                    Matches
                  </p>
                  <p className="text-white text-2xl font-bold">
                    {filteredData.length.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search bar (floats out of hero) ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder='Search countries… (press "/" to focus)'
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition"
            />
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Result meta row */}
        {!loading && filteredData.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-neutral-400">
              Showing{" "}
              <span className="font-semibold text-neutral-600">
                {startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-neutral-600">
                {filteredData.length}
              </span>{" "}
              countries
            </p>
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="text-xs text-cyan-600 hover:text-cyan-800 transition"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-[88px] rounded-2xl bg-neutral-100 animate-pulse"
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        )}

        {/* Country cards grid */}
        {!loading && paginatedData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedData.map((item) => (
              <Link
                key={item.countryInfo?.iso3 || item.country}
                to={`/country/${encodeCountry(item.country)}`}
                className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-200 p-4 flex items-center gap-3"
              >
                {/* Flag */}
                {item.countryInfo?.flag ? (
                  <img
                    src={item.countryInfo.flag}
                    alt={item.country}
                    className="w-10 h-7 object-cover rounded-md shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-10 h-7 bg-neutral-100 rounded-md shrink-0" />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-800 truncate group-hover:text-sky-800 transition">
                    {item.country}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {item.cases?.toLocaleString() ?? "—"} COVID cases
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-neutral-300 group-hover:text-cyan-500 transition shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && paginatedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="font-medium text-neutral-500">No countries found</p>
            <p className="text-sm text-neutral-400">Try a different search term</p>
            <button
              onClick={() => setFilter("")}
              className="mt-2 text-sm text-cyan-600 hover:text-cyan-800 transition"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 mb-14 flex justify-center items-center gap-1.5 px-4 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer px-3 py-1.5 text-sm rounded-xl border transition bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isActive = pageNumber === page;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`cursor-pointer w-9 h-9 text-sm rounded-xl border transition font-medium ${
                  isActive
                    ? "bg-sky-900 text-white border-sky-900 shadow-md shadow-sky-900/20"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cursor-pointer px-3 py-1.5 text-sm rounded-xl border transition bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default BrowsePage;