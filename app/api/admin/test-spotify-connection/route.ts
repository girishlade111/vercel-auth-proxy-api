import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getValidSpotifySession } from "@/lib/spotify"

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated", message: "You must be signed in to test the Spotify connection" },
        { status: 401 },
      )
    }

    if (!session.spotifyAccessToken) {
      return NextResponse.json(
        { error: "No Spotify token", message: "No Spotify access token found in your session" },
        { status: 400 },
      )
    }

    // Test the connection by making a request to the Spotify API
    try {
      // First, ensure we have a valid token
      const validSession = await getValidSpotifySession(session)

      // Make a request to the Spotify API
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${validSession.spotifyAccessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          {
            error: "Spotify API error",
            message: `Failed to connect to Spotify API: ${errorData.error?.message || response.statusText}`,
            data: {
              status: response.status,
              statusText: response.statusText,
              error: errorData,
            },
          },
          { status: response.status },
        )
      }

      const data = await response.json()

      return NextResponse.json({
        success: true,
        message: "Successfully connected to Spotify API",
        data: {
          profile: {
            id: data.id,
            display_name: data.display_name,
            email: data.email,
            product: data.product,
          },
          session: {
            spotifyExpiresAt: validSession.spotifyExpiresAt,
            expiresIn: validSession.spotifyExpiresAt
              ? validSession.spotifyExpiresAt - Math.floor(Date.now() / 1000)
              : null,
          },
        },
      })
    } catch (error) {
      console.error("Error testing Spotify connection:", error)
      return NextResponse.json(
        {
          error: "Connection test failed",
          message: `Error testing Spotify connection: ${error.message || "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in test-spotify-connection route:", error)
    return NextResponse.json(
      { error: "Server error", message: `An unexpected error occurred: ${error.message}` },
      { status: 500 },
    )
  }
}
