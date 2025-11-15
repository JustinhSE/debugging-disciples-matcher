import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
      <main className="flex flex-col items-center justify-center gap-8 text-center px-4 py-20 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Debugging Disciples
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Connect with other Christian developers and find your accountability match.
        </p>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Build your faith while building your tech skills. Join a community of disciples who are committed to growth in both areas.
        </p>
        
        <Link
          href="/onboarding"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          Start Your Onboarding
        </Link>
      </main>
    </div>
  );
}
