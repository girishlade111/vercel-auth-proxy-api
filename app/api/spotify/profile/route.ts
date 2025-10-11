import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { getSpotifyProfile } from "@/lib/spotify"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.spotifyAccessToken) {
      return NextResponse.json({ error: "Not authenticated with Spotify" }, { status: 401 })
    }

    const profile = await getSpotifyProfile(session)

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching Spotify profile:", error)
    return NextResponse.json({ error: "Failed to fetch Spotify profile" }, { status: 500 })
  }
}
