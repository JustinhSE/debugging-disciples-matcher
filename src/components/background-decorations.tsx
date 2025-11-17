"use client";

export function BackgroundDecorations() {
  return (
    <>
      {/* Left side decorations */}
      <div className="fixed left-0 top-0 h-full w-32 pointer-events-none overflow-hidden">
        {/* Floating bug icon */}
        <div className="absolute left-4 top-20 animate-float text-cyan-400 opacity-20 text-4xl">
          🐛
        </div>

        {/* Vertical line */}
        <div className="absolute left-8 top-0 w-0.5 h-full bg-linear-to-b from-cyan-500 via-purple-500 to-transparent opacity-20"></div>

        {/* Code bracket */}
        <div className="absolute left-12 top-40 text-purple-400 opacity-30 text-3xl font-mono font-bold">
          {'<'}
        </div>

        {/* Floating terminal */}
        <div className="absolute left-6 top-1/2 animate-pulse text-blue-400 opacity-20 text-2xl">
          &gt;_
        </div>

        {/* Circle nodes */}
        <div className="absolute left-16 top-32 w-2 h-2 rounded-full bg-cyan-400 opacity-30 animate-pulse"></div>
        <div className="absolute left-10 top-64 w-1.5 h-1.5 rounded-full bg-purple-400 opacity-40 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute left-20 top-96 w-2.5 h-2.5 rounded-full bg-blue-400 opacity-25 animate-pulse" style={{ animationDelay: "1s" }}></div>

        {/* Checkmark */}
        <div className="absolute left-4 bottom-32 text-cyan-400 opacity-20 text-3xl">
          ✓
        </div>

        {/* Additional elements for extended coverage */}
        <div className="absolute left-6 top-3/4 text-purple-400 opacity-15 text-2xl">
          &lt;/&gt;
        </div>
        <div className="absolute left-14 bottom-48 w-1 h-1 rounded-full bg-cyan-400 opacity-20 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        <div className="absolute left-4 top-2/3 text-blue-400 opacity-15 text-xl">
          [ ]
        </div>
      </div>

      {/* Right side decorations */}
      <div className="fixed right-0 top-0 h-full w-32 pointer-events-none overflow-hidden">
        {/* Floating gear */}
        <div className="absolute right-6 top-24 animate-spin text-purple-400 opacity-20 text-4xl" style={{ animationDuration: "20s" }}>
          ⚙️
        </div>

        {/* Vertical line */}
        <div className="absolute right-8 top-0 w-0.5 h-full bg-linear-to-b from-purple-500 via-blue-500 to-transparent opacity-20"></div>

        {/* Code bracket */}
        <div className="absolute right-12 top-52 text-blue-400 opacity-30 text-3xl font-mono font-bold">
          {'>'}
        </div>

        {/* Floating circuit */}
        <div className="absolute right-4 top-1/3 animate-bounce text-blue-400 opacity-20 text-2xl">
          ◈
        </div>

        {/* Circle nodes */}
        <div className="absolute right-16 top-48 w-2 h-2 rounded-full bg-purple-400 opacity-30 animate-pulse" style={{ animationDelay: "0.3s" }}></div>
        <div className="absolute right-10 top-80 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-40 animate-pulse" style={{ animationDelay: "0.7s" }}></div>
        <div className="absolute right-20 top-full -translate-y-24 w-2.5 h-2.5 rounded-full bg-purple-400 opacity-25 animate-pulse" style={{ animationDelay: "1.2s" }}></div>

        {/* Lightning bolt */}
        <div className="absolute right-6 bottom-40 text-yellow-400 opacity-15 text-3xl">
          ⚡
        </div>

        {/* Debug symbol */}
        <div className="absolute right-4 bottom-20 text-cyan-400 opacity-20 text-2xl">
          🔍
        </div>

        {/* Additional elements for extended coverage */}
        <div className="absolute right-6 top-2/3 text-blue-400 opacity-15 text-xl">
          ~ _
        </div>
        <div className="absolute right-14 bottom-64 w-1 h-1 rounded-full bg-purple-400 opacity-20 animate-pulse" style={{ animationDelay: "0.8s" }}></div>
        <div className="absolute right-4 top-1/4 text-cyan-400 opacity-15 text-2xl">
          {'{'}
        </div>
      </div>

      {/* Top glow effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-linear-to-b from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none"></div>

      {/* Bottom glow effect */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-40 bg-linear-to-t from-purple-500/5 via-blue-500/5 to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
