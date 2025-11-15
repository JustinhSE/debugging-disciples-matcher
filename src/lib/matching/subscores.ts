// src/lib/matching/subscores.ts

import {
  AccountabilityLevel,
  FaithSeason,
  MatchPreference,
  Member,
  Pod,
  Stage,
} from "./types";
import { jaccard } from "./utils";

// ---------- Stage & Mentor Fit (20 pts) ----------

function stageToRank(stage: Stage): number {
  switch (stage) {
    case "college":
    case "transfer":
    case "gap_year":
      return 1;
    case "new_grad":
    case "other":
    default:
      return 2;
  }
}

export function stageSubscore(a: Member, b: Member): number {
  const rankA = stageToRank(a.stage);
  const rankB = stageToRank(b.stage);
  const sameStage = rankA === rankB;

  const aPref = a.matchPreference;
  const bPref = b.matchPreference;

  const aWantsPeer = aPref === "peer" || aPref === "no_preference";
  const bWantsPeer = bPref === "peer" || bPref === "no_preference";
  const aWantsMentor = aPref === "mentor";
  const aWantsMentee = aPref === "mentee";
  const bWantsMentor = bPref === "mentor";
  const bWantsMentee = bPref === "mentee";

  // Perfect peer match
  if (aWantsPeer && bWantsPeer && sameStage) return 1.0;

  // A wants mentor, B wants mentee
  if (aWantsMentor && bWantsMentee) {
    return rankB <= rankA ? 1.0 : 0.7;
  }

  // B wants mentor, A wants mentee
  if (bWantsMentor && aWantsMentee) {
    return rankA <= rankB ? 1.0 : 0.7;
  }

  // One flexible, other with preference
  if ((aWantsPeer && (bWantsMentor || bWantsMentee)) ||
      (bWantsPeer && (aWantsMentor || aWantsMentee))) {
    return 0.7;
  }

  return 0.2;
}

// ---------- Pods Overlap (15 pts) ----------

export function podsSubscore(a: Member, b: Member): number {
  return jaccard(a.pods as Pod[], b.pods as Pod[]);
}

// ---------- Tech Interests & Career Goals (15 pts) ----------

export function techSubscore(a: Member, b: Member): number {
  const techOverlap = jaccard(a.techInterests, b.techInterests);
  const goalsOverlap = jaccard(a.careerGoals, b.careerGoals);

  let points = 10 * techOverlap + 5 * goalsOverlap;

  const majorA = a.major.toLowerCase();
  const majorB = b.major.toLowerCase();
  if (majorA && majorB && majorA === majorB) {
    points += 1; // small bonus
  }

  // Normalize to 0–1 (cap at 15)
  return Math.min(points, 15) / 15;
}

// ---------- Faith Season & Support Needs (15 pts) ----------

function faithSeasonToLevel(fs: FaithSeason): number {
  switch (fs) {
    case "exploring":
      return 1;
    case "recently_committed":
      return 2;
    case "growing_consistent":
      return 3;
    case "mature_mentoring":
      return 4;
    default:
      return 2;
  }
}

function faithSeasonSubscore(a: Member, b: Member): number {
  const levelA = faithSeasonToLevel(a.faithSeason);
  const levelB = faithSeasonToLevel(b.faithSeason);
  const distance = Math.abs(levelA - levelB);

  if (distance === 0) return 1.0;
  if (distance === 1) return 0.7;
  if (distance === 2) return 0.4;
  return 0.2;
}

function faithSupportSubscore(a: Member, b: Member): number {
  let raw = 0;

  const needsA = new Set(a.spiritualSupportNeeds);
  const needsB = new Set(b.spiritualSupportNeeds);

  const aIsMature =
    a.faithSeason === "growing_consistent" ||
    a.faithSeason === "mature_mentoring";
  const bIsMature =
    b.faithSeason === "growing_consistent" ||
    b.faithSeason === "mature_mentoring";

  const wantsMentorshipA = needsA.has("mentorship");
  const wantsMentorshipB = needsB.has("mentorship");

  if (wantsMentorshipA && bIsMature) raw += 0.3;
  if (wantsMentorshipB && aIsMature) raw += 0.3;

  if (needsA.has("accountability") && needsB.has("accountability")) raw += 0.3;
  if (needsA.has("prayer_partners") && needsB.has("prayer_partners")) raw += 0.3;
  if (needsA.has("bible_study_partners") && needsB.has("bible_study_partners")) raw += 0.3;

  return Math.min(1.0, raw / 0.9);
}

export function faithSubscore(a: Member, b: Member): number {
  const seasonPoints = 9 * faithSeasonSubscore(a, b);
  const supportPoints = 6 * faithSupportSubscore(a, b);
  return (seasonPoints + supportPoints) / 15;
}

// ---------- Habits & Accountability (15 pts) ----------

function accountabilityToLevel(level: AccountabilityLevel): number {
  switch (level) {
    case "light":
      return 1;
    case "weekly":
    case "group":
      return 2;
    case "daily":
      return 3;
    case "unsure":
    default:
      return 2;
  }
}

function habitSubscore(a: Member, b: Member): number {
  return jaccard(a.habits, b.habits);
}

function accountabilitySubscore(a: Member, b: Member): number {
  const levelA = accountabilityToLevel(a.accountabilityLevel);
  const levelB = accountabilityToLevel(b.accountabilityLevel);
  const diff = Math.abs(levelA - levelB);

  if (diff === 0) return 1.0;
  if (diff === 1) return 0.7;
  return 0.3;
}

export function habitsAndAccountabilitySubscore(
  a: Member,
  b: Member
): number {
  const habitsPoints = 10 * habitSubscore(a, b);
  const accPoints = 5 * accountabilitySubscore(a, b);
  return (habitsPoints + accPoints) / 15;
}

// ---------- Availability & Time Zone (10 pts) ----------

function timezoneSubscore(a: Member, b: Member): number {
  const diff = Math.abs(a.timezoneOffsetHours - b.timezoneOffsetHours);

  if (diff === 0) return 1.0;
  if (diff <= 2) return 0.7;
  if (diff <= 5) return 0.4;
  return 0.2;
}

function timeSlotSubscore(a: Member, b: Member): number {
  return jaccard(a.availabilitySlots, b.availabilitySlots);
}

export function availabilitySubscore(a: Member, b: Member): number {
  const tzPoints = 4 * timezoneSubscore(a, b);
  const slotPoints = 6 * timeSlotSubscore(a, b);
  return (tzPoints + slotPoints) / 10;
}

// ---------- Personality & Community Fit (now 5 pts) ----------

function communityEnvSubscore(a: Member, b: Member): number {
  return jaccard(a.communityEnvironment, b.communityEnvironment);
}

function personalityWordsSubscore(a: Member, b: Member): number {
  const setA = new Set(a.personalityWords.map(w => w.toLowerCase().trim()));
  const setB = new Set(b.personalityWords.map(w => w.toLowerCase().trim()));

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const n = intersection.size;

  if (n === 0) return 0;
  if (n === 1) return 0.5;
  return 1.0;
}

export function personalitySubscore(a: Member, b: Member): number {
  const envPoints = 3.5 * communityEnvSubscore(a, b);
  const wordsPoints = 1.5 * personalityWordsSubscore(a, b);
  return (envPoints + wordsPoints) / 5;
}

// ---------- Social Chemistry (5 pts) ----------

function sportsOverlapSubscore(a: Member, b: Member): number {
  const aNone = a.sportsTheyWatch.length === 0;
  const bNone = b.sportsTheyWatch.length === 0;

  if (aNone && bNone) return 0;
  if (aNone || bNone) return 0.2;

  const overlap = jaccard(a.sportsTheyWatch, b.sportsTheyWatch);

  if (overlap === 1) return 1.0;
  if (overlap >= 0.5) return 0.7;
  if (overlap > 0) return 0.4;
  return 0.3;
}

export function socialChemistrySubscore(a: Member, b: Member): number {
  const hobbyScore = jaccard(a.hobbies, b.hobbies); // 0–1
  const sportsScore = sportsOverlapSubscore(a, b);   // 0–1

  const points = 6 * hobbyScore + 4 * sportsScore;   // 0–10
  return points / 10;
}
