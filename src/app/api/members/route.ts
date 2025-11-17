import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { z } from "zod";

const onboardingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  
  stage: z.string(),
  major: z.string(),
  institution: z.string(),
  linkedinUrl: z.string(),

  faithSeason: z.string(),
  spiritualSupportNeeds: z.array(z.string()).default([]),

  techInterests: z.array(z.string()).default([]),
  careerGoals: z.array(z.string()).default([]),

  communityEnvironment: z.array(z.string()).default([]),
  personalityWords: z.array(z.string()).default([]),

  habits: z.array(z.string()).default([]),
  accountabilityLevel: z.string(),

  pods: z.array(z.string()).default([]), // Coming January 2026

  timezone: z.string(),
  timezoneOffsetHours: z.number().optional(),
  availabilitySlots: z.array(z.string()).default([]),

  matchPreference: z.string(),

  hobbiesRaw: z.array(z.string()).default([]),
  sportsTheyWatch: z.array(z.string()).default([]),
  
  profile: z.string().default(""),
});

function timezoneToOffsetHours(tz: string): number {
  switch (tz) {
    case "America/Los_Angeles":
      return -8;
    case "America/Denver":
      return -7;
    case "America/Chicago":
      return -6;
    case "America/New_York":
      return -5;
    case "UTC":
    default:
      return 0;
  }
}

export async function POST(req: Request) {
  try {
    console.log("📝 POST /api/members - Received request");
    
    const json = await req.json();
    console.log("✓ Parsed JSON");
    
    const parsed = onboardingSchema.safeParse(json);

    if (!parsed.success) {
      console.log("✗ Validation failed:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    console.log("✓ Data validated");

    const data = parsed.data;
    const timezoneOffsetHours = timezoneToOffsetHours(data.timezone);

    console.log("🔗 Connecting to database...");
    const db = await getDb();
    console.log("✓ Connected to database");

    // Fetch userid from user_mappings based on first and last name (case-insensitive)
    let profile = data.profile;
    try {
      const userMapping = await db.collection("user_mappings").findOne({
        firstName: { $regex: `^${data.firstName}$`, $options: "i" },
        lastName: { $regex: `^${data.lastName}$`, $options: "i" },
      });

      if (userMapping && userMapping.userid) {
        profile = `https://debuggingdisciples.slack.com/team/${userMapping.userid}`;
        console.log(`✓ Found userid: ${userMapping.userid}`);
      } else {
        console.warn(`⚠ No userid found for ${data.firstName} ${data.lastName}`);
      }
    } catch (err) {
      console.warn(`⚠ Error looking up userid:`, err);
      // Continue without userid - profile will remain as provided
    }

    const memberDoc = {
      firstName: data.firstName,
      lastName: data.lastName,
      
      stage: data.stage,
      major: data.major,
      institution: data.institution,
      linkedinUrl: data.linkedinUrl,

      faithSeason: data.faithSeason,
      spiritualSupportNeeds: data.spiritualSupportNeeds,

      techInterests: data.techInterests,
      careerGoals: data.careerGoals,

      communityEnvironment: data.communityEnvironment,
      personalityWords: data.personalityWords,

      habits: data.habits,
      accountabilityLevel: data.accountabilityLevel,

      pods: data.pods,

      timezone: data.timezone,
      timezoneOffsetHours,
      availabilitySlots: data.availabilitySlots,

      matchPreference: data.matchPreference,

      hobbies: data.hobbiesRaw,
      sportsTheyWatch: data.sportsTheyWatch,
      
      profile: profile,

      createdAt: new Date(),
    };

    console.log("💾 Inserting member document...");
    const result = await db.collection("members").insertOne(memberDoc);
    console.log("✓ Member inserted with ID:", result.insertedId.toString());

    return NextResponse.json(
      { 
        data: {
          id: result.insertedId.toString(),
          _id: result.insertedId.toString()
        },
        message: "Member saved successfully" 
      },
      { status: 201 }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("✗ Error saving member:", errorMessage);
    console.error("Full error:", err);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "firstName and lastName are required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking for existing member: ${firstName} ${lastName}`);
    const db = await getDb();

    const existingMember = await db.collection("members").findOne({
      firstName: firstName,
      lastName: lastName,
    });

    if (!existingMember) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    console.log("✓ Found existing member:", existingMember._id.toString());
    return NextResponse.json(
      { 
        exists: true,
        member: {
          ...existingMember,
          _id: existingMember._id.toString()
        }
      },
      { status: 200 }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("✗ Error checking member:", errorMessage);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
