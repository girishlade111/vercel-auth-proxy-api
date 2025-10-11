import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { createSpotifyPlaylist, addTracksToPlaylist } from "@/lib/spotify"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.spotifyAccessToken) {
      return NextResponse.json({ error: "Not authenticated with Spotify" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, isPublic, trackUris } = body

    if (!name) {
      return NextResponse.json({ error: "Playlist name is required" }, { status: 400 })
    }

    // Create the playlist
    const playlist = await createSpotifyPlaylist(session, name, description || "", isPublic || false)

    // Add tracks if provided
    if (trackUris && trackUris.length > 0) {
      await addTracksToPlaylist(session, playlist.id, trackUris)
    }

    return NextResponse.json({ playlist })
  } catch (error) {
    console.error("Error creating Spotify playlist:", error)
    return NextResponse.json({ error: "Failed to create Spotify playlist" }, { status: 500 })
  }
}
