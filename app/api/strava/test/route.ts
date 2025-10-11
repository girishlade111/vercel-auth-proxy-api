import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getStravaProfile, StravaApiError } from "@/lib/strava"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated with Strava",
        },
        { status: 401 },
      )
    }

    // Test the Strava API by fetching the athlete profile
    const athlete = await getStravaProfile(session)

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Strava API",
      athlete: {
        id: athlete.id,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        profile: athlete.profile,
        city: athlete.city,
        country: athlete.country,
      },
    })
  } catch (error) {
    console.error("Error testing Strava API:", error)

    if (error instanceof StravaApiError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to Strava API",
          error: error.message,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
