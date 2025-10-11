import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Return status of environment variables (not the actual values for security)
    return NextResponse.json({
      stravaClientId: process.env.STRAVA_CLIENT_ID ? "Set ✓" : "Not set ✗",
      stravaClientSecret: process.env.STRAVA_CLIENT_SECRET ? "Set ✓" : "Not set ✗",
    })
  } catch (error) {
    console.error("Error checking environment variables:", error)
    return NextResponse.json({ error: "Failed to check environment variables" }, { status: 500 })
  }
}
