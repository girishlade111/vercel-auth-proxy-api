import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { getSpotifyPlaylists } from "@/lib/spotify"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { mockSpotifyPlaylists } from "@/lib/mock-data"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "No session found. Please sign in.",
        },
        { status: 401 },
      )
    }

    // Check if we're in demo mode (using credentials provider)
    const isDemoMode = session.accessToken === "demo-strava-token"

    if (isDemoMode) {
      // Return mock data for demo mode
      return NextResponse.json({ playlists: { items: mockSpotifyPlaylists, total: mockSpotifyPlaylists.length } })
    }

    if (!session.spotifyAccessToken) {
      return NextResponse.json(
        {
          error: "Spotify authentication required",
          details: "No Spotify access token found. Please connect your Spotify account.",
        },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    try {
      const playlists = await getSpotifyPlaylists(session, limit, offset)
      return NextResponse.json({ playlists })
    } catch (spotifyError: any) {
      console.error("Spotify API error:", spotifyError)
      return NextResponse.json(
        {
          error: "Spotify API error",
          details: spotifyError.message || "Failed to fetch playlists from Spotify API",
          status: spotifyError.status || 500,
        },
        { status: spotifyError.status || 500 },
      )
    }
  } catch (error: any) {
    console.error("Error fetching Spotify playlists:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
