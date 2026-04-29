import React, { useEffect, useState, useMemo } from "react";
import { slideToTop } from "../utils";
import BrowseSearchBar from "../components/BrowseSeachBar";
import API_URL from "../api";
import BrowseCard from "../components/BrowseCard";

const ITEMS_PER_PAGE = 10;
const MAX_PAGES = 10;

function BrowsePage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    slideToTop();

    fetch(`${API_URL}/api.json`)
      .then((res) => res.json())
      .then((res) => setData((res.value || []).slice(2)))
      .catch((err) => console.error(err));
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
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

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <div className="pt-24 pb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Search GHO Record
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          Browse and filter available entries
        </p>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <BrowseSearchBar value={filter} onChange={setFilter} />
      </div>

      {/* List */}
      <div className="mt-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col gap-3">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <BrowseCard key={item.id || item.name} title={item.name} url={item.url} />
          ))
        ) : (
          <p className="text-center text-neutral-400 py-10">
            No results found
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 mb-12 flex justify-center gap-2 px-4 flex-wrap">
        {Array.from({ length: MAX_PAGES }).map((_, i) => {
          const pageNumber = i + 1;
          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`
                cursor-pointer px-3 py-1 text-sm rounded-md border transition
                ${
                  isActive
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                }
              `}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BrowsePage;