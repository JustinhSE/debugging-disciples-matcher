export type Stage =
  | "college"
  | "new_grad"
  | "transfer"
  | "gap_year"
  | "other";

export type FaithSeason =
  | "exploring"
  | "recently_committed"
  | "growing_consistent"
  | "mature_mentoring";

export type MatchPreference =
  | "peer"
  | "mentor"
  | "mentee"
  | "no_preference";

export type AccountabilityLevel =
  | "light"
  | "weekly"
  | "daily"
  | "group"
  | "unsure";

export type Pod =
  | "deploy"
  | "debug"
  | "pr_review"
  | "systems_integrity";

export type TimeSlot =
  | "weekday_mornings"
  | "weekday_evenings"
  | "weekend_mornings"
  | "weekend_evenings"
  | "flexible"
  | "async_only";

export interface Member {
  id: string;

  stage: Stage;
  major: string;
  institution: string;
  linkedinUrl: string;

  faithSeason: FaithSeason;
  spiritualSupportNeeds: string[];

  techInterests: string[];
  careerGoals: string[];

  communityEnvironment: string[];
  personalityWords: string[];

  habits: string[];
  accountabilityLevel: AccountabilityLevel;

  pods: Pod[];

  timezoneOffsetHours: number;
  availabilitySlots: TimeSlot[];

  matchPreference: MatchPreference;

  hobbies: string[];
  sportsTheyWatch: string[];
}

export type MatchTier = "strong" | "good" | "soft" | "weak";
