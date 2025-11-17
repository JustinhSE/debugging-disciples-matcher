"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Users, Briefcase, Slack, Linkedin } from "lucide-react";

interface MatchMember {
  _id: string;
  firstName: string;
  lastName: string;
  stage: string;
  major: string;
  institution: string;
  linkedinUrl: string;
  faithSeason: string;
  accountabilityLevel: string;
  matchPreference: string;
  personalityWords: string[];
  hobbiesRaw: string[];
  sportsTheyWatch: string[];
  profile: string;
  matchScore: number;
}

export default function ResultsPage() {
  const [matches, setMatches] = React.useState<MatchMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [memberCount, setMemberCount] = React.useState(0);

  React.useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Get member ID from session storage
        const memberId = typeof window !== "undefined" 
          ? sessionStorage.getItem("memberId")
          : null;

        if (!memberId) {
          setError("No member session found. Please complete onboarding.");
          setLoading(false);
          return;
        }

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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Finding Your Matches...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06b6d4] mx-auto"></div>
        </div>
      </div>
    );
  }

  if (memberCount < 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">
            Profile Saved! 🎉
          </h1>
          <p className="text-lg text-[#a1a1aa]">
            We&apos;re building the community! Currently {memberCount} member{memberCount !== 1 ? "s" : ""} have joined.
          </p>
          <p className="text-base text-[#808080]">
            We&apos;ll show you matches once we reach 5 members. Check back soon!
          </p>
          <Link href="/">
            <Button className="mt-8 bg-[#06b6d4] text-[#000000] hover:bg-[#06b6d4]/80">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-red-500">Error</h1>
          <p className="text-lg text-[#a1a1aa]">{error}</p>
          <Link href="/">
            <Button className="mt-8 bg-[#06b6d4] text-[#000000] hover:bg-[#06b6d4]/80">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to the Community! 🤝
          </h1>
          <p className="text-lg text-[#a1a1aa] mb-4">
            We found {matches.length} excellent matches based on your profile.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[#a1a1aa]">
            <Heart size={16} className="text-[#06b6d4]" />
            <span>Check out your personalized matches below</span>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          {matches.map((match, index) => (
            <Card key={match._id} className="overflow-hidden bg-[#0a0a0a] border-[#27272a]">
              <CardHeader className="bg-[#18181b] border-b border-[#27272a]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-[#06b6d4] to-[#8b5cf6] text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">
                        {match.firstName} {match.lastName}{" "}
                        <span className="text-sm font-normal text-[#a1a1aa]">
                          ({match.stage === "college"
                            ? "College Student"
                            : match.stage === "new_grad"
                              ? "New Grad / Early Career"
                              : match.stage})
                        </span>
                      </CardTitle>
                      <CardDescription className="text-[#a1a1aa]">
                        {match.major} • {match.institution}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#06b6d4]">
                      {Math.round(match.matchScore * 100)}%
                    </div>
                    <div className="text-xs text-[#a1a1aa] mb-3">compatibility</div>
                    {match.profile && match.profile.trim() ? (
                      <a href={match.profile} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-[#0ACE6E] hover:bg-[#0ACE6E]/80 text-white gap-2 h-8 text-xs">
                          <Slack size={14} />
                          Connect
                        </Button>
                      </a>
                    ) : match.linkedinUrl ? (
                      <a href={match.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white gap-2 h-8 text-xs">
                          <Linkedin size={14} />
                          Connect
                        </Button>
                      </a>
                    ) : (
                      <Button disabled className="bg-[#27272a] text-[#808080] gap-2 h-8 text-xs cursor-not-allowed">
                        <Slack size={14} />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-white">
                      <Heart size={16} className="text-[#06b6d4]" />
                      Profile Highlights
                    </h4>
                    <ul className="text-sm text-[#a1a1aa] space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-[#06b6d4]">•</span>
                        <span>
                          Faith Journey: <strong>{match.faithSeason.replace(/_/g, " ")}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#06b6d4]">•</span>
                        <span>
                          Accountability Level: <strong>{match.accountabilityLevel}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#06b6d4]">•</span>
                        <span>
                          Match Preference: <strong>{match.matchPreference === "no_preference" ? "Open to Any" : match.matchPreference}</strong>
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-[#27272a] pt-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2 text-white">
                          <Users size={16} className="text-[#8b5cf6]" />
                          Personality
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {match.personalityWords.slice(0, 3).map((word) => (
                            <Badge key={word} className="bg-[#18181b] text-[#06b6d4] border border-[#06b6d4] text-xs">
                              {word}
                            </Badge>
                          ))}
                          {match.personalityWords.length > 3 && (
                            <Badge className="bg-[#27272a] text-[#a1a1aa] border border-[#27272a] text-xs">
                              +{match.personalityWords.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2 text-white">
                          🎮 Hobbies
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {match.hobbiesRaw.length > 0 ? (
                            <>
                              {match.hobbiesRaw.slice(0, 3).map((hobby) => (
                                <Badge key={hobby} className="bg-[#18181b] text-[#3b82f6] border border-[#3b82f6] text-xs">
                                  {hobby}
                                </Badge>
                              ))}
                              {match.hobbiesRaw.length > 3 && (
                                <Badge className="bg-[#27272a] text-[#a1a1aa] border border-[#27272a] text-xs">
                                  +{match.hobbiesRaw.length - 3} more
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-[#808080]">Not specified</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2 text-white">
                          🏆 Sports
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {match.sportsTheyWatch.length > 0 ? (
                            <>
                              {match.sportsTheyWatch.slice(0, 3).map((sport) => (
                                <Badge key={sport} className="bg-[#18181b] text-[#ec4899] border border-[#ec4899] text-xs">
                                  {sport}
                                </Badge>
                              ))}
                              {match.sportsTheyWatch.length > 3 && (
                                <Badge className="bg-[#27272a] text-[#a1a1aa] border border-[#27272a] text-xs">
                                  +{match.sportsTheyWatch.length - 3} more
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-[#808080]">Not specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Card className="p-6 bg-linear-to-r from-[#06b6d4]/10 to-[#8b5cf6]/10 border border-[#06b6d4]/30">
            <h3 className="font-semibold text-white mb-2">Next Steps</h3>
            <p className="text-sm text-[#a1a1aa] mb-4">
              You&apos;re all set! Your matches have been identified. 
              Check back as the community grows for more connection opportunities.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline" className="border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10">
                  <ArrowLeft className="mr-2" size={16} />
                  Return Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
