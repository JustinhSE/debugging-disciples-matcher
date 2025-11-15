"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  pods: z.array(z.string()).default([]),

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

const STEPS = [
  { id: 1, title: "Your Info", description: "Name and basic details" },
  { id: 2, title: "Education", description: "School and tech focus" },
  { id: 3, title: "Faith", description: "Your spiritual journey" },
  { id: 4, title: "Tech & Career", description: "Interests and goals" },
  { id: 5, title: "Personality", description: "Traits and habits" },
  { id: 6, title: "Accountability", description: "Preferences and details" },
];

export function MemberOnboardingForm({
  onSubmitMember,
  isSubmitting: parentIsSubmitting,
}: MemberOnboardingFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [localSubmitting, setLocalSubmitting] = React.useState(false);
  const totalSteps = STEPS.length;

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
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

  // Use local submitting state, but also check parent state
  const isSubmitting = localSubmitting || parentIsSubmitting;

  // Watch all fields to trigger re-renders when they change
  const allValues = form.watch();

  const onSubmit = (values: OnboardingFormValues) => {
    setLocalSubmitting(true);
    onSubmitMember(values);
  };

  const handleManualSubmit = () => {
    // Validate all fields before submission
    form.trigger().then((isValid) => {
      if (isValid) {
        const values = form.getValues() as OnboardingFormValues;
        setLocalSubmitting(true);
        onSubmitMember(values);
      }
    });
  };

  const isStepValid = React.useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          allValues.firstName?.trim() !== "" &&
          allValues.lastName?.trim() !== ""
        );
      case 2:
        return (
          allValues.stage &&
          allValues.major?.trim() !== "" &&
          allValues.institution?.trim() !== "" &&
          allValues.linkedinUrl?.trim() !== ""
        );
      case 3:
        return allValues.faithSeason !== undefined;
      case 4:
        return (
          Array.isArray(allValues.techInterests) &&
          allValues.techInterests.length > 0 &&
          Array.isArray(allValues.careerGoals) &&
          allValues.careerGoals.length > 0
        );
      case 5:
        return (
          allValues.personalityWords?.trim() !== "" &&
          Array.isArray(allValues.habits) &&
          allValues.habits.length > 0
        );
      case 6:
        return (
          allValues.accountabilityLevel !== undefined &&
          allValues.matchPreference !== undefined
        );
      default:
        return false;
    }
  }, [currentStep, allValues]);

  const handleNext = () => {
    if (!isStepValid) {
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInArray = (fieldName: keyof OnboardingFormValues, value: string) => {
    const current = form.getValues(fieldName) as string[];
    if (current.includes(value)) {
      form.setValue(
        fieldName,
        current.filter((v) => v !== value),
        { shouldDirty: true }
      );
    } else {
      form.setValue(fieldName, [...current, value], {
        shouldDirty: true,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8 max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {STEPS[currentStep - 1].title}
            </h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex-1 h-1 rounded-full transition-all ${
                  step.id <= currentStep
                    ? "bg-[#06b6d4]"
                    : "bg-slate-700 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        {/* Step 1: Your Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
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
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What best describes you? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormLabel>Major / STEM focus *</FormLabel>
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
                  <FormLabel>School or company *</FormLabel>
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
                  <FormLabel>LinkedIn Profile URL *</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.linkedin.com/in/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Used only to verify you're a real person.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 3: Faith */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="faithSeason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which best describes your faith season? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your faith season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="exploring">Exploring faith</SelectItem>
                      <SelectItem value="recently_committed">Recently committed</SelectItem>
                      <SelectItem value="growing_consistent">Growing and consistent</SelectItem>
                      <SelectItem value="mature_mentoring">Mature and mentoring</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spiritualSupportNeeds"
              render={() => (
                <FormItem>
                  <FormLabel>What do you need spiritually? (select all)</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Daily prayer support",
                      "Bible study group",
                      "Mentorship",
                      "Encouragement",
                      "Accountability",
                    ].map((need) => (
                      <FormItem key={need} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={(form.getValues("spiritualSupportNeeds") || []).includes(need)}
                            onCheckedChange={() =>
                              toggleInArray("spiritualSupportNeeds", need)
                            }
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{need}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 4: Tech & Career */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="techInterests"
              render={() => (
                <FormItem>
                  <FormLabel>What tech interests you? (select all)</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Web Development",
                      "Mobile Development",
                      "AI/Machine Learning",
                      "Data Science",
                      "Cloud Computing",
                      "DevOps",
                      "Cybersecurity",
                      "Game Development",
                    ].map((interest) => (
                      <FormItem key={interest} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={(form.getValues("techInterests") || []).includes(interest)}
                            onCheckedChange={() =>
                              toggleInArray("techInterests", interest)
                            }
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{interest}</FormLabel>
                      </FormItem>
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
                  <FormLabel>What are your career goals? (select all)</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Startup founder",
                      "Big tech engineer",
                      "Consultant",
                      "Researcher",
                      "Entrepreneurial",
                      "Work-life balance",
                    ].map((goal) => (
                      <FormItem key={goal} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={(form.getValues("careerGoals") || []).includes(goal)}
                            onCheckedChange={() =>
                              toggleInArray("careerGoals", goal)
                            }
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{goal}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 5: Personality */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="personalityWords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What words describe you? *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g., creative, analytical, ambitious, thoughtful (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter personality traits separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="habits"
              render={() => (
                <FormItem>
                  <FormLabel>What are your habits? (select all)</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Early riser",
                      "Night owl",
                      "Gym/Exercise",
                      "Coding projects",
                      "Reading",
                      "Gaming",
                      "Social meetups",
                    ].map((habit) => (
                      <FormItem key={habit} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={(form.getValues("habits") || []).includes(habit)}
                            onCheckedChange={() =>
                              toggleInArray("habits", habit)
                            }
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{habit}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hobbiesRaw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your hobbies?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g., photography, cooking, hiking (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter hobbies separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 6: Accountability & Preferences */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="accountabilityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What level of accountability do you want? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select accountability level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light check-ins</SelectItem>
                      <SelectItem value="weekly">Weekly accountability</SelectItem>
                      <SelectItem value="daily">Daily accountability</SelectItem>
                      <SelectItem value="group">Group accountability</SelectItem>
                      <SelectItem value="unsure">Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matchPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What type of match do you prefer? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="peer">Peer (same level)</SelectItem>
                      <SelectItem value="mentor">Mentor (guide me)</SelectItem>
                      <SelectItem value="mentee">Mentee (I'll guide)</SelectItem>
                      <SelectItem value="no_preference">No preference</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific</SelectItem>
                      <SelectItem value="America/Denver">Mountain</SelectItem>
                      <SelectItem value="America/Chicago">Central</SelectItem>
                      <SelectItem value="America/New_York">Eastern</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sportsTheyWatch"
              render={() => (
                <FormItem>
                  <FormLabel>What sports do you follow?</FormLabel>
                  <div className="space-y-2">
                    {[
                      "NFL",
                      "NBA",
                      "MLB",
                      "Soccer",
                      "College Football",
                      "College Basketball",
                    ].map((sport) => (
                      <FormItem key={sport} className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={(form.getValues("sportsTheyWatch") || []).includes(sport)}
                            onCheckedChange={() =>
                              toggleInArray("sportsTheyWatch", sport)
                            }
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{sport}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button
              type="button"
              onClick={handleManualSubmit}
              disabled={isSubmitting || !isStepValid}
              className="ml-auto"
            >
              {isSubmitting ? "Submitting..." : "Complete Profile"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid}
              className="ml-auto flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </Button>
          )}
        </div>

        {/* Progress text */}
        <div className="text-center text-sm text-muted-foreground">
          {currentStep} / {totalSteps}
        </div>
      </form>
    </Form>
  );
}
