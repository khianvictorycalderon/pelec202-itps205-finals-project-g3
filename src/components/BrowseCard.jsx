import { Link } from "react-router-dom";

export default function BrowseCard({ title, url, index }) {
  return (
    <Link
      to={`/record/${url}`}
      className="
        group relative w-full
        flex items-center gap-4
        px-5 py-4
        bg-white
        border border-neutral-200
        rounded-2xl
        shadow-sm
        overflow-hidden
        transition-all duration-200 ease-out
        hover:shadow-lg hover:shadow-cyan-100/60
        hover:border-cyan-300
        hover:-translate-y-[2px]
      "
    >
      {/* Subtle left fill on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      {/* Index number */}
      <span className="relative shrink-0 w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-cyan-100 flex items-center justify-center text-xs font-mono font-semibold text-neutral-400 group-hover:text-cyan-600 transition-colors duration-200">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Title */}
      <div className="relative flex-1 min-w-0">
        <h2 className="text-sm sm:text-base font-medium text-neutral-700 group-hover:text-neutral-900 truncate transition-colors duration-200">
          {title}
        </h2>
        <p className="text-xs font-mono text-neutral-400 group-hover:text-cyan-500 truncate mt-0.5 transition-colors duration-200">
          {url}
        </p>
      </div>

      {/* Arrow icon */}
      <div className="relative shrink-0 w-7 h-7 rounded-full border border-neutral-200 group-hover:border-cyan-300 group-hover:bg-cyan-50 flex items-center justify-center transition-all duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-neutral-300 group-hover:text-cyan-500 translate-x-0 group-hover:translate-x-0.5 transition-all duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}