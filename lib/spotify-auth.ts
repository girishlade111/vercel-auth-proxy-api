import type { Session } from "next-auth"

// Function to refresh the Spotify access token
export async function refreshSpotifyToken(session: Session): Promise<Session> {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("Missing Spotify API credentials in environment variables")
  }

  if (!session.spotifyRefreshToken) {
    throw new Error("No Spotify refresh token available")
  }

  try {
    console.log("Refreshing Spotify token directly...")

    // Use the direct Spotify API for token refresh
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: session.spotifyRefreshToken,
      }).toString(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Spotify token refresh failed:", errorData)
      throw new Error(`Spotify token refresh failed: ${errorData.error || response.statusText}`)
    }

    const refreshedTokens = await response.json()
    console.log("Spotify token refreshed successfully")

    // Update the session with new tokens
    return {
      ...session,
      spotifyAccessToken: refreshedTokens.access_token,
      spotifyRefreshToken: refreshedTokens.refresh_token ?? session.spotifyRefreshToken,
      spotifyExpiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
    }
  } catch (error) {
    console.error("Error refreshing Spotify access token", error)
    throw error
  }
}

// Check if the Spotify token needs to be refreshed
export async function getValidSpotifySession(session: Session): Promise<Session> {
  if (!session?.spotifyAccessToken) {
    throw new Error("No Spotify access token available")
  }

  // If the token is expired or will expire in the next 5 minutes, refresh it
  const fiveMinutesInSeconds = 5 * 60
  if (session.spotifyExpiresAt && session.spotifyExpiresAt - Math.floor(Date.now() / 1000) < fiveMinutesInSeconds) {
    console.log("Spotify token expired or expiring soon, refreshing...")
    return refreshSpotifyToken(session)
  }

  return session
}
