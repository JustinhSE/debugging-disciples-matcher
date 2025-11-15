"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { Stage, FaithSeason, MatchPreference, AccountabilityLevel, Pod, TimeSlot } from "@/lib/matching/types";

// ---------- Zod Schema ----------

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  
  stage: z.enum(["college", "new_grad", "transfer", "gap_year", "other"]),
  major: z.string().min(2),
  institution: z.string().min(2),
  linkedinUrl: z.string().url(),

  faithSeason: z.enum([
    "exploring",
    "recently_committed",
    "growing_consistent",
    "mature_mentoring",
  ] as const),

  spiritualSupportNeeds: z.array(z.string()).default([]),

  techInterests: z.array(z.string()).default([]),
  careerGoals: z.array(z.string()).default([]),

  communityEnvironment: z.array(z.string()).default([]),
  personalityWords: z.string().default(""),

  habits: z.array(z.string()).default([]),
  accountabilityLevel: z.enum([
    "light",
    "weekly",
    "daily",
    "group",
    "unsure",
  ] as const),

  pods: z.array(z.string()).default([]), // Coming January 2026 - optional for now

  timezone: z.string().default("America/New_York"),
  timezoneOffsetHours: z.number().optional(),
  availabilitySlots: z.array(z.string()).default([]),

  matchPreference: z.enum([
    "peer",
    "mentor",
    "mentee",
    "no_preference",
  ] as const),

  hobbiesRaw: z.string().default(""),
  sportsTheyWatch: z.array(z.string()).default([]),
});

type OnboardingFormValues = z.infer<typeof formSchema>;

export type { OnboardingFormValues };

interface MemberOnboardingFormProps {
  onSubmitMember: (data: OnboardingFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function MemberOnboardingForm({
  onSubmitMember,
  isSubmitting,
}: MemberOnboardingFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      stage: "college",
      major: "",
      institution: "",
      linkedinUrl: "",
      faithSeason: "growing_consistent",
      spiritualSupportNeeds: [],
      techInterests: [],
      careerGoals: [],
      communityEnvironment: [],
      personalityWords: "",
      habits: [],
      accountabilityLevel: "weekly",
      pods: [],
      timezone: "America/New_York",
      availabilitySlots: [],
      matchPreference: "peer",
      hobbiesRaw: "",
      sportsTheyWatch: [],
    },
  });

  const onSubmit = (values: OnboardingFormValues) => {
    onSubmitMember(values);
  };

  // Helper for checkbox lists
  const toggleInArray = (field: string, value: string) => {
    const current = form.getValues(field as any) as string[];
    if (current.includes(value)) {
      form.setValue(
        field as any,
        current.filter((v) => v !== value),
        { shouldDirty: true }
      );
    } else {
      form.setValue(field as any, [...current, value], {
        shouldDirty: true,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 max-w-2xl mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Identity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Name</h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Identity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">About You</h2>

          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What best describes you?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="college">College student</SelectItem>
                    <SelectItem value="new_grad">New grad / early career</SelectItem>
                    <SelectItem value="transfer">Transfer student</SelectItem>
                    <SelectItem value="gap_year">Gap year</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major / STEM focus</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science, Data Science, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School or company</FormLabel>
                <FormControl>
                  <Input placeholder="Stony Brook University, Google, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.linkedin.com/in/..." {...field} />
                </FormControl>
                <FormDescription>
                  Used only to verify you’re a real person and see your tech journey.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Faith */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Faith</h2>

          <FormField
            control={form.control}
            name="faithSeason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which best describes your current faith season?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your faith season" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="exploring">Exploring faith</SelectItem>
                    <SelectItem value="recently_committed">Recently committed</SelectItem>
                    <SelectItem value="growing_consistent">
                      Growing and consistent
                    </SelectItem>
                    <SelectItem value="mature_mentoring">
                      Mature and mentoring others
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Support needs checkboxes */}
          <FormField
            control={form.control}
            name="spiritualSupportNeeds"
            render={() => (
              <FormItem>
                <FormLabel>What kind of spiritual support are you hoping for?</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    ["accountability", "Accountability"],
                    ["prayer_partners", "Prayer partners"],
                    ["bible_study_partners", "Bible study partners"],
                    ["discipleship", "Practical life discipleship"],
                    ["community", "Community / friendships"],
                    ["mentorship", "Mentorship"],
                    ["unsure", "Not sure yet"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form
                          .getValues("spiritualSupportNeeds") ?? [])
                          .includes(value)}
                        onCheckedChange={() =>
                          toggleInArray("spiritualSupportNeeds", value)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tech & Career */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tech & Career</h2>

          <FormField
            control={form.control}
            name="techInterests"
            render={() => (
              <FormItem>
                <FormLabel>Main technical interests</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Software Engineering",
                    "Machine Learning / AI",
                    "Data Science",
                    "Cybersecurity",
                    "Cloud / DevOps",
                    "Hardware / Robotics",
                    "Product / UX",
                    "Undecided / Exploring",
                  ].map((label) => (
                    <label
                      key={label}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form.getValues("techInterests") ?? []).includes(label)}
                        onCheckedChange={() =>
                          toggleInArray("techInterests", label)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="careerGoals"
            render={() => (
              <FormItem>
                <FormLabel>Current STEM / career goals</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Getting an internship",
                    "Landing full-time",
                    "Improving coding skills",
                    "Building projects",
                    "Learning AI",
                    "Finding collaborators",
                    "Breaking into Big Tech",
                    "Balancing faith & work",
                  ].map((label) => (
                    <label
                      key={label}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form.getValues("careerGoals") ?? []).includes(label)}
                        onCheckedChange={() =>
                          toggleInArray("careerGoals", label)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Community & Personality */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Community & Personality</h2>

          <FormField
            control={form.control}
            name="communityEnvironment"
            render={() => (
              <FormItem>
                <FormLabel>What type of environment helps you grow?</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    ["structured", "Structured & disciplined"],
                    ["encouraging", "Encouraging & supportive"],
                    ["small_deep", "Small & deep conversations"],
                    ["high_energy", "Active & high-energy"],
                    ["listener", "More listening than talking"],
                    ["one_on_one", "One-on-one connections"],
                    ["group", "Group-based connections"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form
                          .getValues("communityEnvironment") ?? [])
                          .includes(value)}
                        onCheckedChange={() =>
                          toggleInArray("communityEnvironment", value)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalityWords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your personality in 3 words</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. introverted, curious, disciplined"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Separate words with commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Habits & Accountability */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Habits & Accountability</h2>

          <FormField
            control={form.control}
            name="habits"
            render={() => (
              <FormItem>
                <FormLabel>What habits are you working on?</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Prayer consistency",
                    "Bible reading",
                    "Fitness",
                    "Discipline / time management",
                    "Academic improvement",
                    "Mental health",
                    "Social skills",
                    "Purity / resetting discipline",
                    "Building projects",
                    "Posting on LinkedIn",
                  ].map((label) => (
                    <label
                      key={label}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form.getValues("habits") ?? []).includes(label)}
                        onCheckedChange={() => toggleInArray("habits", label)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountabilityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What level of accountability are you comfortable with?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accountability level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light check-ins</SelectItem>
                    <SelectItem value="weekly">Weekly partner</SelectItem>
                    <SelectItem value="daily">Daily partner</SelectItem>
                    <SelectItem value="group">Group accountability</SelectItem>
                    <SelectItem value="unsure">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pods - Coming January 2026 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pods</h2>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded">
            🔜 Coming January 2026 - Pods will be available soon!
          </p>

          <div className="opacity-50 blur-sm pointer-events-none">
            <FormField
              control={form.control}
              name="pods"
              render={() => (
                <FormItem>
                  <FormLabel>Which pods do you want to join?</FormLabel>
                  <FormDescription>
                    Coming January 2026 - Pods will be available soon!
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    ["deploy", "Deploy Pod (Faith in action)"],
                    ["debug", "Debug Pod (Faith growth)"],
                    ["pr_review", "PR Review Pod (Career)"],
                    ["systems_integrity", "Systems Integrity Pod (Discipline)"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form.getValues("pods") || []).includes(value)}
                        onCheckedChange={() => toggleInArray("pods", value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Availability</h2>

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time zone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your time zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* extend this list as needed */}
                    <SelectItem value="America/Los_Angeles">
                      Pacific (PT)
                    </SelectItem>
                    <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                    <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availabilitySlots"
            render={() => (
              <FormItem>
                <FormLabel>When are you usually available?</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    ["weekday_mornings", "Weekday mornings"],
                    ["weekday_evenings", "Weekday evenings"],
                    ["weekend_mornings", "Weekend mornings"],
                    ["weekend_evenings", "Weekend evenings"],
                    ["flexible", "Flexible"],
                    ["async_only", "Prefer async only"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form
                          .getValues("availabilitySlots") ?? [])
                          .includes(value)}
                        onCheckedChange={() =>
                          toggleInArray("availabilitySlots", value)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Match Preference */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Match Preference</h2>

          <FormField
            control={form.control}
            name="matchPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who would you prefer to be matched with?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="peer">
                      Someone at a similar stage (peer)
                    </SelectItem>
                    <SelectItem value="mentor">
                      Someone further ahead (mentor)
                    </SelectItem>
                    <SelectItem value="mentee">
                      Someone I can help (mentee)
                    </SelectItem>
                    <SelectItem value="no_preference">No preference</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Social Chemistry */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Hobbies & Sports</h2>

          <FormField
            control={form.control}
            name="hobbiesRaw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What hobbies are you into?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g. gym, basketball, chess, music production, gaming"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Separate hobbies with commas. We use this to match you with guys
                  you’ll actually vibe with.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sportsTheyWatch"
            render={() => (
              <FormItem>
                <FormLabel>What sports do you enjoy watching?</FormLabel>
                <FormDescription>Select all that apply.</FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Football (NFL)",
                    "Basketball (NBA)",
                    "Soccer",
                    "UFC",
                    "Formula 1",
                    "College Football",
                    "College Basketball",
                    "Tennis",
                    "Don’t really watch sports",
                  ].map((label) => (
                    <label
                      key={label}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={(form
                          .getValues("sportsTheyWatch") ?? [])
                          .includes(label)}
                        onCheckedChange={() =>
                          toggleInArray("sportsTheyWatch", label)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Join Debugging Disciples Matching"}
        </Button>
      </form>
    </Form>
  );
}
