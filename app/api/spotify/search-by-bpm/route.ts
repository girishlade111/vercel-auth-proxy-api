import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { searchTracksByBpm } from "@/lib/spotify"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.spotifyAccessToken) {
      return NextResponse.json({ error: "Not authenticated with Spotify" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const minBpm = Number.parseInt(searchParams.get("minBpm") || "120")
    const maxBpm = Number.parseInt(searchParams.get("maxBpm") || "180")
    const genres = searchParams.get("genres")?.split(",")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const tracks = await searchTracksByBpm(session, minBpm, maxBpm, genres, limit)

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error("Error searching tracks by BPM:", error)
    return NextResponse.json({ error: "Failed to search tracks by BPM" }, { status: 500 })
  }
}
