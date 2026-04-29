import React from 'react';

export default function BrowseSearchBar({ value, onChange }) {
  return (
    <div className="relative group">
      {/* Glow ring on focus */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-400/30 to-teal-400/30 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />

      <div className="relative flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-5 py-3.5 shadow-sm group-focus-within:border-cyan-400 transition-colors duration-200">
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-neutral-300 group-focus-within:text-cyan-500 transition-colors duration-200 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          placeholder="Search datasets…"
          className="flex-1 outline-none text-sm text-neutral-800 placeholder:text-neutral-400 bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="w-5 h-5 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Count badge slot — filled by parent via children or just styling */}
        {!value && (
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200 text-[10px] text-neutral-400 font-mono select-none">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}