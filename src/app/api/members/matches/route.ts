import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const membersCollection = db.collection("members");

    // Check total member count
    const totalMembers = await membersCollection.countDocuments();

    if (totalMembers < 5) {
      return NextResponse.json({
        matches: [],
        totalMembers,
        message: "Not enough members yet",
      });
    }

    // Get the current member
    let currentMemberId: ObjectId;
    try {
      currentMemberId = new ObjectId(memberId);
    } catch {
      return NextResponse.json(
        { error: "Invalid member ID format" },
        { status: 400 }
      );
    }

    const currentMember = await membersCollection.findOne({
      _id: currentMemberId,
    });

    if (!currentMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Get all other members
    const allOtherMembers = await membersCollection
      .find({ _id: { $ne: currentMemberId } })
      .toArray();

    // Calculate match scores for all other members
    const scoredMatches = allOtherMembers.map((member: any) => {
      const matchScore = calculateMatchScore(currentMember, member);
      return {
        ...member,
        matchScore,
      };
    });

    // Sort by match score and get top 3
    const topMatches = scoredMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map((match: any) => ({
        _id: match._id.toString(),
        firstName: match.firstName,
        lastName: match.lastName,
        stage: match.stage,
        major: match.major,
        institution: match.institution,
        faithSeason: match.faithSeason,
        accountabilityLevel: match.accountabilityLevel,
        matchPreference: match.matchPreference,
        personalityWords: match.personalityWords || [],
        hobbiesRaw: match.hobbiesRaw || [],
        sportsTheyWatch: match.sportsTheyWatch || [],
        matchScore: match.matchScore,
      }));

    return NextResponse.json({
      matches: topMatches,
      totalMembers,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

function calculateMatchScore(member1: any, member2: any): number {
  let score = 0;
  let maxScore = 0;

  // Stage compatibility (20 points)
  maxScore += 20;
  if (member1.stage === member2.stage) {
    score += 20;
  } else if (
    (member1.stage === "college" && member2.stage === "gap_year") ||
    (member1.stage === "gap_year" && member2.stage === "college")
  ) {
    score += 10;
  }

  // Faith season alignment (15 points)
  maxScore += 15;
  if (member1.faithSeason === member2.faithSeason) {
    score += 15;
  } else if (
    (member1.faithSeason === "exploring" &&
      member2.faithSeason === "recently_committed") ||
    (member1.faithSeason === "recently_committed" &&
      member2.faithSeason === "exploring")
  ) {
    score += 8;
  }

  // Accountability level compatibility (15 points)
  maxScore += 15;
  if (member1.accountabilityLevel === member2.accountabilityLevel) {
    score += 15;
  } else if (
    (member1.accountabilityLevel === "light" &&
      member2.accountabilityLevel === "weekly") ||
    (member1.accountabilityLevel === "weekly" &&
      member2.accountabilityLevel === "light")
  ) {
    score += 8;
  }

  // Match preference compatibility (20 points)
  maxScore += 20;
  const pref1 = member1.matchPreference;
  const pref2 = member2.matchPreference;
  if (pref1 === pref2 || pref1 === "no_preference" || pref2 === "no_preference") {
    score += 20;
  } else if (
    (pref1 === "peer" && pref2 === "peer") ||
    (pref1 === "mentor" && pref2 === "mentee") ||
    (pref1 === "mentee" && pref2 === "mentor")
  ) {
    score += 20;
  }

  // Tech interests overlap (15 points)
  maxScore += 15;
  const interestsOverlap = (member1.techInterests || []).filter((t: string) =>
    (member2.techInterests || []).includes(t)
  ).length;
  if (interestsOverlap > 0) {
    score += Math.min(interestsOverlap * 5, 15);
  }

  // Career goals overlap (10 points)
  maxScore += 10;
  const goalsOverlap = (member1.careerGoals || []).filter((g: string) =>
    (member2.careerGoals || []).includes(g)
  ).length;
  if (goalsOverlap > 0) {
    score += Math.min(goalsOverlap * 3, 10);
  }

  // Spiritual needs compatibility (5 points)
  maxScore += 5;
  const needsOverlap = (member1.spiritualSupportNeeds || []).filter(
    (n: string) => (member2.spiritualSupportNeeds || []).includes(n)
  ).length;
  if (needsOverlap > 0) {
    score += Math.min(needsOverlap * 2, 5);
  }

  return Math.round((score / maxScore) * 100) / 100;
}
