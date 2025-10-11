import type { Session } from "next-auth"

// Base URL for the Spotify Auth Proxy
const SPOTIFY_PROXY_URL = "https://www.runnershigh.uk"

// Function to make authenticated requests through the proxy
export async function spotifyProxyFetch(endpoint: string, session: Session): Promise<Response> {
  if (!session?.spotifyAccessToken) {
    throw new Error("No Spotify access token available")
  }

  try {
    const response = await fetch(`${SPOTIFY_PROXY_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${session.spotifyAccessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error("Spotify proxy error:", error)
      throw new Error(`Spotify proxy error: ${error.error?.message || response.statusText}`)
    }

    return response
  } catch (error) {
    console.error("Error making proxy request:", error)
    throw error
  }
}

// Get the current user's Spotify profile through the proxy
export async function getSpotifyProfileViaProxy(session: Session) {
  const response = await spotifyProxyFetch("/api/spotify/me", session)
  return response.json()
}

// Check Spotify API status through the proxy
export async function checkSpotifyStatusViaProxy(session: Session) {
  const response = await spotifyProxyFetch("/api/spotify/status", session)
  return response.json()
}

// Get the current session from the proxy
export async function getProxySession(sessionToken: string) {
  try {
    const response = await fetch(`${SPOTIFY_PROXY_URL}/api/auth/session`, {
      headers: {
        Cookie: `next-auth.session-token=${sessionToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get session from proxy: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to get session from proxy:", error)
    throw error
  }
}

// Check if the proxy is available
export async function checkProxyHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${SPOTIFY_PROXY_URL}/api/healthcheck`)
    return response.ok
  } catch (error) {
    console.error("Proxy health check failed:", error)
    return false
  }
}
