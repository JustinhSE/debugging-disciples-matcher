import { MatchTier, Member } from "./types";
import {
  availabilitySubscore,
  faithSubscore,
  habitsAndAccountabilitySubscore,
  podsSubscore,
  personalitySubscore,
  socialChemistrySubscore,
  stageSubscore,
  techSubscore,
} from "./subscores";

export function matchScore(a: Member, b: Member): number {
  const stageScore = 20 * stageSubscore(a, b);
  const podsScore = 15 * podsSubscore(a, b);
  const techScore = 15 * techSubscore(a, b);
  const faithScore = 15 * faithSubscore(a, b);
  const habitsScore = 15 * habitsAndAccountabilitySubscore(a, b);
  const availabilityScore = 10 * availabilitySubscore(a, b);
  const personalityScore = 5 * personalitySubscore(a, b);
  const socialChemistryScore = 5 * socialChemistrySubscore(a, b);

  const total =
    stageScore +
    podsScore +
    techScore +
    faithScore +
    habitsScore +
    availabilityScore +
    personalityScore +
    socialChemistryScore;

  return Math.max(0, Math.min(100, total));
}

export function classifyMatch(score: number): MatchTier {
  if (score >= 80) return "strong";
  if (score >= 65) return "good";
  if (score >= 50) return "soft";
  return "weak";
}

export function rankMatchesForMember(
  target: Member,
  others: Member[]
): { member: Member; score: number; tier: MatchTier }[] {
  return others
    .filter((m) => m.id !== target.id)
    .map((m) => {
      const score = matchScore(target, m);
      return { member: m, score, tier: classifyMatch(score) };
    })
    .sort((a, b) => b.score - a.score);
}
