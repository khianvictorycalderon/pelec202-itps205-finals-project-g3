import React from "react";

const RecordCard = ({ record }) => {
  const {
    SpatialDim,
    SpatialDimType,
    ParentLocation,
    TimeDim,
    Value,
    NumericValue,
    Low,
    High,
    Dim1,
    Dim1Type,
    Dim2,
    Dim2Type,
    Comments,
  } = record;

  const displayValue = NumericValue != null
    ? Number(NumericValue).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : (Value ?? "—");

  const hasRange = Low != null && High != null;

  const badges = [
    { label: Dim1Type, value: Dim1 },
    { label: Dim2Type, value: Dim2 },
  ].filter((b) => b.label && b.value);

  return (
    <div className="group w-full bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row">

        {/* Left accent bar */}
        <div className="w-full sm:w-1 sm:min-h-full h-1 bg-gradient-to-r sm:bg-gradient-to-b from-cyan-400 to-teal-600 shrink-0" />

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">

            {/* Country + region */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-900 flex items-center justify-center shrink-0">
                <span className="text-cyan-300 font-bold text-xs tracking-wide">
                  {SpatialDim?.slice(0, 3) ?? "??"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-neutral-800 text-sm leading-tight">
                  {SpatialDim ?? "Unknown"}
                  <span className="ml-1.5 text-xs font-normal text-neutral-400">
                    ({SpatialDimType})
                  </span>
                </p>
                {ParentLocation && (
                  <p className="text-xs text-neutral-400 mt-0.5">{ParentLocation}</p>
                )}
              </div>
            </div>

            {/* Year + Value */}
            <div className="flex items-center gap-4">
              {TimeDim && (
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Year</p>
                  <p className="text-sm font-semibold text-neutral-700">{TimeDim}</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Value</p>
                <p className="text-lg font-bold text-teal-700 leading-tight">{displayValue}</p>
                {hasRange && (
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {Number(Low).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    {" – "}
                    {Number(High).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dimension badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {badges.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-100 text-xs text-teal-700">
                  <span className="text-neutral-400">{b.label}:</span> {b.value}
                </span>
              ))}
            </div>
          )}

          {/* Comments */}
          {Comments && (
            <p className="mt-3 text-xs text-neutral-400 italic line-clamp-2">{Comments}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordCard;