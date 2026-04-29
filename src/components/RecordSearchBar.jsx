import React from 'react';

export default function RecordSearchBar({ value, onChange, sortBy, onSortChange, regionFilter, onRegionChange, regions = [] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Search input */}
      <div className="flex-1 flex items-center gap-2 border border-neutral-200 bg-white rounded-xl px-4 py-2.5 shadow-sm focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Filter by country, region..."
          className="w-full outline-none text-sm text-neutral-800 placeholder:text-neutral-400 bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button onClick={() => onChange('')} className="text-neutral-300 hover:text-neutral-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Region filter */}
      {regions.length > 0 && (
        <select
          value={regionFilter}
          onChange={(e) => onRegionChange(e.target.value)}
          className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-700 shadow-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all cursor-pointer"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      )}

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-700 shadow-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all cursor-pointer"
      >
        <option value="country_asc">Country A → Z</option>
        <option value="country_desc">Country Z → A</option>
        <option value="year_desc">Year (Newest)</option>
        <option value="year_asc">Year (Oldest)</option>
        <option value="value_desc">Value (High → Low)</option>
        <option value="value_asc">Value (Low → High)</option>
      </select>
    </div>
  );
}