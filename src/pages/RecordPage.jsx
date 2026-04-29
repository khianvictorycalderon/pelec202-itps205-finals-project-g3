import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { slideToTop } from '../utils';
import API_URL from '../api';
import RecordCard from '../components/RecordCard';
import RecordSearchBar from '../components/RecordSearchBar';

const ITEMS_PER_PAGE = 12;
const MAX_PAGES = 10;

function RecordPage() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('country_asc');
  const [regionFilter, setRegionFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    slideToTop();
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((res) => setData(res.value || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Reset page on filter/sort change
  useEffect(() => { setPage(1); }, [search, sortBy, regionFilter]);

  // Unique regions for the dropdown
  const regions = useMemo(() => {
    const set = new Set(data.map((r) => r.ParentLocation).filter(Boolean));
    return [...set].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data.filter((item) => {
      const haystack = [
        item.SpatialDim,
        item.ParentLocation,
        item.Value,
        item.Dim1,
        item.Dim2,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesRegion = !regionFilter || item.ParentLocation === regionFilter;
      return matchesSearch && matchesRegion;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'country_asc':
          return (a.SpatialDim ?? '').localeCompare(b.SpatialDim ?? '');
        case 'country_desc':
          return (b.SpatialDim ?? '').localeCompare(a.SpatialDim ?? '');
        case 'year_desc':
          return (b.TimeDim ?? 0) - (a.TimeDim ?? 0);
        case 'year_asc':
          return (a.TimeDim ?? 0) - (b.TimeDim ?? 0);
        case 'value_desc':
          return (b.NumericValue ?? -Infinity) - (a.NumericValue ?? -Infinity);
        case 'value_asc':
          return (a.NumericValue ?? Infinity) - (b.NumericValue ?? Infinity);
        default:
          return 0;
      }
    });

    return result;
  }, [data, search, sortBy, regionFilter]);

  const totalPages = Math.min(
    MAX_PAGES,
    Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE))
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">

      {/* ── Hero header ── */}
      <div className="bg-sky-900 pt-24 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-200 text-sm transition mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Browse
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
                Indicator Code
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white break-all">
                {id}
              </h1>
            </div>

            {!loading && !error && (
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Total</p>
                  <p className="text-white text-xl font-bold">{data.length.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Filtered</p>
                  <p className="text-white text-xl font-bold">{filteredData.length.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Regions</p>
                  <p className="text-white text-xl font-bold">{regions.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      {!loading && !error && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
          <div className="bg-white rounded-xl shadow-md border border-neutral-100 p-4">
            <RecordSearchBar
              value={search}
              onChange={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
              regionFilter={regionFilter}
              onRegionChange={setRegionFilter}
              regions={regions}
            />
          </div>
        </div>
      )}

      {/* ── States ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin" />
            <p className="text-neutral-400 text-sm">Loading records for <span className="font-mono text-neutral-600">{id}</span>…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-neutral-600 font-medium">Failed to load data</p>
            <p className="text-neutral-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && paginatedData.length === 0 && (
          <p className="text-center text-neutral-400 py-16">No records match your filters.</p>
        )}

        {/* ── Cards ── */}
        {!loading && !error && paginatedData.length > 0 && (
          <div className="flex flex-col gap-3">
            {paginatedData.map((record) => (
              <RecordCard key={record.Id} record={record} />
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-8 mb-14 flex justify-center gap-2 px-4 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer px-3 py-1 text-sm rounded-md border transition bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
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
                className={`
                  cursor-pointer px-3 py-1 text-sm rounded-md border transition
                  ${isActive
                    ? 'bg-sky-900 text-white border-sky-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'}
                `}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cursor-pointer px-3 py-1 text-sm rounded-md border transition bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default RecordPage;