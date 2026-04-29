import { DEVELOPERS } from "../devs";

export default function Footer() {

  // Split developers into 3 columns
  const chunkSize = Math.ceil(DEVELOPERS.length / 3);

  const columns = [
    DEVELOPERS.slice(0, chunkSize),
    DEVELOPERS.slice(chunkSize, chunkSize * 2),
    DEVELOPERS.slice(chunkSize * 2)
  ];

  return (
    <>
      <footer className="w-full bg-sky-900 text-white font-sans">
        <div className="max-w-[1100px] mx-auto px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-cyan-300/10">

            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-cyan-300 font-bold text-sm">
                  Global Health Observatory
                </span>
                <span className="font-mono text-[10px] text-white/30 border border-white/10 px-2 py-[2px] rounded">
                  API
                </span>
              </div>

              <p className="text-sm text-white/50 leading-relaxed max-w-[220px] mb-4">
                Our project in PELEC202 + ITPS205 subject. (2nd Sem. 2025 - 2026).
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/25 border border-cyan-300/20 text-cyan-300 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Prof: <a href="https://github.com/itzzmerov" rel="noopener noreferrer" target="_blank" className="underline hover:scale-[1.05] transition duration-300 cursor-pointer">John Rovie Balingbing</a>
              </div>
            </div>

            {/* Developers (3 columns) */}
            {columns.map((group, colIndex) => (
              <div key={colIndex}>
                <h4 className="font-mono text-[10px] tracking-[2px] uppercase text-cyan-300 mb-4">
                  Developers
                </h4>

                <ul className="space-y-2 text-sm text-white/50">
                  {group.map((dev, i) => (
                    <li key={i}>
                      <a
                        href={dev.ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-300 transition"
                      >
                        {dev.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-7">

            <p className="text-xs font-mono text-white/40">
              © {(new Date()).getFullYear()} <span className="text-cyan-300">GHO API</span>. All rights reserved.
            </p>

            <div className="flex gap-5 text-xs text-white/40">
              <a className="hover:text-cyan-300 transition" href="https://github.com/khianvictorycalderon/pelec202-itps205-finals-project-g3" target="_blank">Source Code</a>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}