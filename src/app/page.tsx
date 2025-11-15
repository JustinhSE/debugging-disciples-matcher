import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000]">
      <main className="flex flex-col items-center justify-center gap-8 text-center px-4 py-20 max-w-2xl">
        <div className="space-y-2 mb-8">
          <div className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-[#06b6d4]/20 to-[#8b5cf6]/20 border border-[#06b6d4]/30">
            <span className="text-sm font-medium text-[#06b6d4]">Welcome to Debugging Disciples</span>
          </div>
        </div>

        <h1 className="text-6xl font-bold tracking-tight text-white bg-linear-to-r from-[#06b6d4] via-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
          Debugging Disciples
        </h1>
        
        <p className="text-xl text-[#a1a1aa] max-w-lg">
          Connect with other Christian developers and find your match.
        </p>
        
        <p className="text-base text-[#808080]">
          Build your faith while building your tech skills. Join a community of disciples who are committed to growth in both areas.
        </p>
        
        <Link
          href="/onboarding"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-[#06b6d4] px-8 font-semibold text-[#000000] transition-all hover:shadow-lg hover:shadow-[#06b6d4]/50 hover:scale-105"
        >
          Start Your Onboarding
        </Link>

        <div className="mt-16 pt-8 border-t border-[#27272a]">
          <p className="text-xs text-[#808080]">
            Launching January 2026 • Built for STEM professionals who code with purpose
          </p>
        </div>
      </main>
    </div>
  );
}
