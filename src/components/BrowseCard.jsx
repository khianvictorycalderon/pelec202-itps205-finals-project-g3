import { Link } from "react-router-dom";

export default function BrowseCard({ title, url }) {
  return (
    <Link
      to={`/record/${url}`}
      className="
        w-full
        p-5 sm:p-6
        bg-white
        border border-neutral-200
        rounded-xl
        shadow-sm
        flex items-center justify-between
        cursor-pointer
        transition-all duration-200 ease-out
        hover:shadow-md
        hover:border-neutral-300
        hover:-translate-y-[2px]
      "
    >
      <h2 className="text-base sm:text-lg font-medium text-neutral-800 truncate whitespace-nowrap overflow-hidden">
        {title}
      </h2>

      <div className="w-2 h-2 rounded-full bg-neutral-300 shrink-0 ml-4" />
    </Link>
  );
}