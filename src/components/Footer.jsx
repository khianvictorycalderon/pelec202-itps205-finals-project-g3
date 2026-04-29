export default function Footer() {
  return (
    <>
      {/* Only custom CSS needed (no tailwind.config.js required) */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <footer className="w-full bg-sky-900 text-white font-sans">
        {/* Top bar */}
        <div className="h-[3px] bg-gradient-to-r from-teal-600 via-cyan-300 to-teal-600 shimmer" />

        <div className="max-w-[1100px] mx-auto px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-cyan-300/10">

            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-red-500" />
                <span className="font-mono text-cyan-300 font-bold text-sm">
                  YourAPI
                </span>
                <span className="font-mono text-[10px] text-white/30 border border-white/10 px-2 py-[2px] rounded">
                  v2.1
                </span>
              </div>

              <p className="text-sm text-white/50 leading-relaxed max-w-[220px] mb-4">
                A powerful, developer-first API platform built for speed,
                reliability, and scale.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/25 border border-cyan-300/20 text-cyan-300 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                All systems operational
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-mono text-[10px] tracking-[2px] uppercase text-cyan-300 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a className="hover:text-cyan-300 transition" href="#">Overview</a></li>
                <li><a className="hover:text-cyan-300 transition" href="#">REST API</a></li>
                <li><a className="hover:text-cyan-300 transition" href="#">WebSocket API</a></li>
                <li><a className="hover:text-cyan-300 transition" href="#">SDKs</a></li>
                <li><a className="hover:text-cyan-300 transition" href="#">Webhooks</a></li>
                <li><a className="hover:text-cyan-300 transition" href="#">
                  Changelog <span className="text-[9px] font-mono bg-teal-700/40 text-cyan-300 px-1.5 rounded">new</span>
                </a></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="font-mono text-[10px] tracking-[2px] uppercase text-cyan-300 mb-4">
                Developers
              </h4>
              <ul className="space-y-2 text-sm text-white/50">
                {["Documentation", "API Reference", "Quickstart", "Playground", "Status Page", "Community"].map(
                  (item) => (
                    <li key={item}>
                      <a className="hover:text-cyan-300 transition" href="#">
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-mono text-[10px] tracking-[2px] uppercase text-cyan-300 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-white/50">
                {["About", "Blog", "Pricing", "Contact", "Support"].map(
                  (item) => (
                    <li key={item}>
                      <a className="hover:text-cyan-300 transition" href="#">
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-7">

            <p className="text-xs font-mono text-white/40">
              © 2026 <span className="text-cyan-300">YourAPI</span>. All rights reserved.
            </p>

            <div className="flex gap-5 text-xs text-white/40">
              <a className="hover:text-cyan-300 transition" href="#">Privacy Policy</a>
              <a className="hover:text-cyan-300 transition" href="#">Terms</a>
              <a className="hover:text-cyan-300 transition" href="#">Cookie Policy</a>
            </div>

            {/* Social placeholders */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg border border-cyan-300/20 hover:bg-cyan-300/10 transition cursor-pointer" />
              <div className="w-8 h-8 rounded-lg border border-cyan-300/20 hover:bg-cyan-300/10 transition cursor-pointer" />
              <div className="w-8 h-8 rounded-lg border border-cyan-300/20 hover:bg-cyan-300/10 transition cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}