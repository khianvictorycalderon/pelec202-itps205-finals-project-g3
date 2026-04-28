export default function BrowseCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        w-[820px] h-[150px] p-7 rounded-[0px]
        border border-cyan-300
        flex flex-col justify-center
        relative overflow-hidden
        cursor-pointer transition-transform duration-300 ease-in-out
        hover:scale-105
      "
    >
      <div className="w-[300px] h-[4px] bg-cyan-300 rounded mb-2.5"></div>

      <h2 className="text-[26px] font-bold mb-2.5 tracking-wide font-serif ">
        {title}
      </h2>

      <div className="w-[30px] h-[3px] bg-cyan-300 mb-2"></div>

      <p className="text-[14px] leading-relaxed max-w-[90%] font-sans">
        {description}
      </p>
    </div>
  );
} 