"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MemberOnboardingForm, type OnboardingFormValues } from "@/components/member-onboarding-form";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmitMember = async (values: OnboardingFormValues) => {
    setIsSubmitting(true);
    try {
      const timezoneOffsetHours = -new Date().getTimezoneOffset() / 60;
      
      // Parse personalityWords and hobbiesRaw from strings into arrays
      const personalityWordsArray = values.personalityWords
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean);

      const hobbiesArray = (values.hobbiesRaw ?? "")
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

      const body = {
        ...values,
        timezoneOffsetHours,
        personalityWords: personalityWordsArray,
        hobbiesRaw: hobbiesArray,
      };

      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to submit: ${res.status} ${errText}`);
      }

      const json = await res.json();
      
      toast.success("Welcome! Your profile has been saved.");

      // Redirect to results page with member ID
      router.push(`/results?memberId=${json.data._id || json.data.id}`); 

    } catch (err) {
      console.error(err);
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <MemberOnboardingForm 
        onSubmitMember={handleSubmitMember} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
