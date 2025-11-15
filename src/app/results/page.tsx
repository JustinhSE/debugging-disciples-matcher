"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MatchMember {
  _id: string;
  stage: string;
  major: string;
  institution: string;
  faithSeason: string;
  accountabilityLevel: string;
  matchPreference: string;
  personalityWords: string[];
  matchScore: number;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get("memberId");
  
  const [matches, setMatches] = React.useState<MatchMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [memberCount, setMemberCount] = React.useState(0);

  React.useEffect(() => {
    const fetchMatches = async () => {
      if (!memberId) {
        setError("No member ID provided");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/members/matches?memberId=${memberId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await res.json();
        setMatches(data.matches || []);
        setMemberCount(data.totalMembers || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load your matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [memberId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Finding Your Matches...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (memberCount < 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Profile Saved! 🎉
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            We&apos;re building the community! Currently {memberCount} member{memberCount !== 1 ? "s" : ""} have joined.
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400">
            We&apos;ll show you matches once we reach 5 members. Check back soon!
          </p>
          <Link href="/">
            <Button className="mt-8">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-red-600">Error</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{error}</p>
          <Link href="/">
            <Button className="mt-8">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Your Top Matches 🤝
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Here are your 3 most compatible accountability partners based on your profile.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg">
            <p className="text-slate-600 dark:text-slate-300">
              No matches found. Please try adjusting your preferences.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match, index) => (
              <div
                key={match._id}
                className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-8 border-l-4 border-blue-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      Match #{index + 1}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {match.stage === "college"
                        ? "College Student"
                        : match.stage === "new_grad"
                          ? "New Grad / Early Career"
                          : match.stage}
                    </h2>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(match.matchScore * 100)}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Education
                    </p>
                    <p className="text-slate-900 dark:text-white mt-1">{match.major}</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {match.institution}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Faith Journey
                    </p>
                    <p className="text-slate-900 dark:text-white mt-1">
                      {match.faithSeason.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Accountability Level
                    </p>
                    <p className="text-slate-900 dark:text-white mt-1">
                      {match.accountabilityLevel}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Match Preference
                    </p>
                    <p className="text-slate-900 dark:text-white mt-1">
                      {match.matchPreference}
                    </p>
                  </div>
                </div>

                {match.personalityWords && match.personalityWords.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Personality
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {match.personalityWords.map((word, i) => (
                        <span
                          key={i}
                          className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" className="mt-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
