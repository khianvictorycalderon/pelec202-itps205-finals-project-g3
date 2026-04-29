import React from "react";

const RecordCard = ({
  title,
  value,
  unit,
  disaggregationOptions = [],
}) => {
  return (
    <div className="grid grid-cols-[2.8fr_1.2fr] min-h-[400px] w-full">
      {/* Left Card */}
      <section className="bg-cyan-100 p-10 rounded-l-xl shadow-[-10px_10px_30px_rgba(0,96,100,0.05)]">
        <div className="mb-6">
          <h2 className="text-teal-800 text-xl font-bold">{title}</h2>

          <div className="flex items-end text-teal-800 mt-4">
            <span className="text-6xl font-extrabold leading-none">
              {value}
            </span>
            <span className="ml-3 text-sm font-medium">{unit}</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex gap-10">
          <div>{/* Left content */}</div>
          <div>{/* Right content */}</div>
        </div>
      </section>

      {/* Right Sidebar */}
      <section className="bg-teal-800 text-white p-8 rounded-r-xl shadow-[10px_10px_30px_rgba(0,0,0,0.1)]">
        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {disaggregationOptions.map((item, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-md border text-sm transition-all ${
                index === 0
                  ? "bg-white text-teal-800 border-white"
                  : "border-white/30 hover:bg-cyan-400 hover:text-teal-800 hover:border-cyan-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Links placeholder */}
        <div className="flex flex-col gap-4">
          <a href="#" className="text-cyan-100 text-sm hover:text-cyan-400">
            View data source
          </a>
          <a href="#" className="text-cyan-100 text-sm hover:text-cyan-400">
            Download dataset
          </a>
        </div>
      </section>
    </div>
  );
};

export default RecordCard;