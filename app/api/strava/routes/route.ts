import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getStravaRoutes, StravaApiError } from "@/lib/strava"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated with Strava",
        },
        { status: 401 },
      )
    }

    const routes = await getStravaRoutes(session)

    return NextResponse.json({
      success: true,
      routes,
    })
  } catch (error) {
    console.error("Error fetching Strava routes:", error)

    if (error instanceof StravaApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
