import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSpotifyProfile } from "@/lib/spotify"

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated", message: "You must be signed in to test the Spotify API" },
        { status: 401 },
      )
    }

    if (!session.spotifyAccessToken) {
      return NextResponse.json(
        { error: "No Spotify token", message: "No Spotify access token found in your session" },
        { status: 400 },
      )
    }

    // Test the connection by fetching the user's Spotify profile
    try {
      const profile = await getSpotifyProfile(session)

      return NextResponse.json({
        success: true,
        message: "Successfully connected to Spotify API",
        profile: {
          id: profile.id,
          display_name: profile.display_name,
          email: profile.email,
          product: profile.product,
          images: profile.images,
          country: profile.country,
        },
        tokenInfo: {
          expiresAt: session.spotifyExpiresAt,
          expiresIn: session.spotifyExpiresAt ? session.spotifyExpiresAt - Math.floor(Date.now() / 1000) : null,
        },
      })
    } catch (error) {
      console.error("Error testing Spotify API:", error)
      return NextResponse.json(
        {
          error: "API test failed",
          message: `Error testing Spotify API: ${error.message || "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in Spotify test route:", error)
    return NextResponse.json(
      { error: "Server error", message: `An unexpected error occurred: ${error.message}` },
      { status: 500 },
    )
  }
}
