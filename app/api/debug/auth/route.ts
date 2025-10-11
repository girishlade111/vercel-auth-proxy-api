import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  // Get the current time to check token expiration
  const now = Math.floor(Date.now() / 1000)

  // Calculate time remaining for tokens
  const stravaExpiresIn = session?.expiresAt ? session.expiresAt - now : null
  const spotifyExpiresIn = session?.spotifyExpiresAt ? session.spotifyExpiresAt - now : null

  return NextResponse.json({
    auth: {
      authenticated: !!session,
      user: session?.user
        ? {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }
        : null,
      strava: {
        connected: !!session?.accessToken,
        tokenExpired: stravaExpiresIn !== null ? stravaExpiresIn <= 0 : null,
        expiresIn: stravaExpiresIn,
      },
      spotify: {
        connected: !!session?.spotifyAccessToken,
        tokenExpired: spotifyExpiresIn !== null ? spotifyExpiresIn <= 0 : null,
        expiresIn: spotifyExpiresIn,
      },
      error: session?.error || null,
    },
    env: {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL.substring(0, 8)}...` : "Not set",
      callbackUrls: {
        strava: `${process.env.NEXTAUTH_URL}/api/auth/callback/strava`,
        spotify: `${process.env.NEXTAUTH_URL}/api/auth/callback/spotify`,
      },
    },
    timestamp: new Date().toISOString(),
  })
}
