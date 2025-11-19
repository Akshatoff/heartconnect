// src/app/api/profile/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
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
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        firstName,
        lastName,
        age: parseInt(age.toString()),
        gender: gender as "MALE" | "FEMALE" | "NON_BINARY",
        about: about || null,
        city,
        state,
        country,
        disabilityType: disabilityType || null,
        interests: interests || [],
        lookingForGender: lookingForGender || null,
        preferredCities: preferredCities || [],
        caregiverName: hasCaregiver && caregiverName ? caregiverName : null,
        caregiverPhone: hasCaregiver && caregiverPhone ? caregiverPhone : null,
        caregiverEmail: hasCaregiver && caregiverEmail ? caregiverEmail : null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully!",
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 },
    );
  }
}
