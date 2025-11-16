import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      supabaseId,
      firstName,
      lastName,
      age,
      gender,
      about,
      city,
      state,
      country,
      disabilityType,
      interests,
      lookingForGender,
      preferredCities,
      hasCaregiver,
      caregiverName,
      caregiverPhone,
      caregiverEmail,
    } = data;

    // Find user by supabaseId
    const user = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 },
      );
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        age: parseInt(age.toString()),
        gender: gender as "MALE" | "FEMALE" | "NON_BINARY",
        about: about || undefined,
        city,
        state,
        country,
        disabilityType: disabilityType || undefined,
        interests: interests || [],
        lookingForGender: lookingForGender || undefined,
        preferredCities: preferredCities || [],
        caregiverName:
          hasCaregiver && caregiverName ? caregiverName : undefined,
        caregiverPhone:
          hasCaregiver && caregiverPhone ? caregiverPhone : undefined,
        caregiverEmail:
          hasCaregiver && caregiverEmail ? caregiverEmail : undefined,
        status: "PENDING",
        isVerified: false,
      },
    });

    return NextResponse.json({
      success: true,
      profileId: profile.id,
      message: "Profile created successfully! Pending admin approval.",
    });
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile", details: error.message },
      { status: 500 },
    );
  }
}
