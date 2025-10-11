import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  return NextResponse.json({
    auth: {
      session: session ? "Available" : "Not available",
      user: session?.user ? "Available" : "Not available",
    },
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "Set" : "Not set",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
      STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID ? "Set" : "Not set",
      STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET ? "Set" : "Not set",
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ? "Set" : "Not set",
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ? "Set" : "Not set",
    },
    timestamp: new Date().toISOString(),
  })
}
