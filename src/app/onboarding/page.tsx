"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MemberOnboardingForm, type OnboardingFormValues } from "@/components/member-onboarding-form-multistep";
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

      // Store member ID in session storage and redirect to results
      if (typeof window !== "undefined") {
        sessionStorage.setItem("memberId", json.data._id || json.data.id);
      }
      router.push("/results"); 

    } catch (err) {
      console.error(err);
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Profile</h1>
          <p className="text-[#a1a1aa]">Join the Debugging Disciples community and find your match</p>
        </div>
        <MemberOnboardingForm 
          onSubmitMember={handleSubmitMember} 
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
