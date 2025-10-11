import type { Session } from "next-auth"

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: { url: string }[]
  product: string
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  public: boolean
  collaborative: boolean
  images: { url: string }[]
  tracks: {
    total: number
    items?: SpotifyTrack[]
  }
  owner: {
    id: string
    display_name: string
  }
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: {
    id: string
    name: string
  }[]
  album: {
    id: string
    name: string
    images: { url: string }[]
  }
  duration_ms: number
  popularity: number
  preview_url: string | null
}

export interface SpotifyAudioFeatures {
  id: string
  tempo: number // BPM
  energy: number
  danceability: number
  valence: number
  acousticness: number
  instrumentalness: number
  liveness: number
  loudness: number
  speechiness: number
  key: number
  mode: number
  time_signature: number
}

// Error class for Spotify API errors
export class SpotifyApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "SpotifyApiError"
    this.status = status
    this.data = data
  }
}

// Function to refresh the Spotify access token if it's expired
export async function refreshSpotifyToken(session: Session): Promise<Session> {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new SpotifyApiError("Missing Spotify API credentials in environment variables", 500)
  }

  if (!session.spotifyRefreshToken) {
    throw new SpotifyApiError("No Spotify refresh token available", 401)
  }

  try {
    console.log("Refreshing Spotify token...")

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
      throw new SpotifyApiError(
        `Spotify token refresh failed: ${errorData.error || response.statusText}`,
        response.status,
        errorData,
      )
    }

    const refreshedTokens = await response.json()

    // Update the session with new tokens
    const updatedSession = {
      ...session,
      spotifyAccessToken: refreshedTokens.access_token,
      spotifyRefreshToken: refreshedTokens.refresh_token ?? session.spotifyRefreshToken,
      spotifyExpiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
    }

    // If this is running on the client, update the session
    if (typeof window !== "undefined") {
      const event = new Event("visibilitychange")
      document.dispatchEvent(event)
    }

    return updatedSession
  } catch (error) {
    console.error("Error refreshing Spotify access token", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to refresh Spotify token: ${error.message || "Unknown error"}`, 500)
  }
}

// Function to get a valid Spotify session with fresh tokens
export async function getValidSpotifySession(session: Session): Promise<Session> {
  if (!session?.spotifyAccessToken) {
    throw new Error("No Spotify access token available")
  }

  // If there's a refresh error, throw it
  if (session.spotifyError === "RefreshAccessTokenError") {
    throw new Error("Failed to refresh Spotify access token. Please sign in again.")
  }

  return session
}

// Get the current user's Spotify profile
export async function getSpotifyProfile(session: Session) {
  const validSession = await getValidSpotifySession(session)

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${validSession.spotifyAccessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error("Spotify API error:", error)
    throw new Error(`Spotify API error: ${error.error?.message || response.statusText}`)
  }

  return response.json()
}

// Get the user's playlists
export async function getSpotifyPlaylists(
  session: Session,
  limit = 20,
  offset = 0,
): Promise<{ items: SpotifyPlaylist[]; total: number }> {
  try {
    const validSession = await getValidSpotifySession(session)

    const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${validSession.spotifyAccessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new SpotifyApiError(
        `Failed to fetch Spotify playlists: ${errorData.error?.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Spotify playlists:", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to fetch Spotify playlists: ${error.message || "Unknown error"}`, 500)
  }
}

// Get a specific playlist
export async function getSpotifyPlaylist(session: Session, playlistId: string): Promise<SpotifyPlaylist> {
  try {
    const validSession = await getValidSpotifySession(session)

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${validSession.spotifyAccessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new SpotifyApiError(
        `Failed to fetch Spotify playlist: ${errorData.error?.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Spotify playlist:", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to fetch Spotify playlist: ${error.message || "Unknown error"}`, 500)
  }
}

// Create a new playlist
export async function createSpotifyPlaylist(
  session: Session,
  name: string,
  description: string,
  isPublic = false,
): Promise<SpotifyPlaylist> {
  try {
    const validSession = await getValidSpotifySession(session)
    const user = await getSpotifyProfile(validSession)

    const response = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${validSession.spotifyAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        public: isPublic,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new SpotifyApiError(
        `Failed to create Spotify playlist: ${errorData.error?.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error creating Spotify playlist:", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to create Spotify playlist: ${error.message || "Unknown error"}`, 500)
  }
}

// Add tracks to a playlist
export async function addTracksToPlaylist(
  session: Session,
  playlistId: string,
  trackUris: string[],
): Promise<{ snapshot_id: string }> {
  try {
    const validSession = await getValidSpotifySession(session)

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${validSession.spotifyAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new SpotifyApiError(
        `Failed to add tracks to playlist: ${errorData.error?.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error adding tracks to playlist:", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to add tracks to playlist: ${error.message || "Unknown error"}`, 500)
  }
}

// Search for tracks by BPM
export async function searchTracksByBPM(session: Session, bpm: number, limit = 10) {
  const validSession = await getValidSpotifySession(session)

  // Spotify doesn't have a direct BPM search, so we'll search for tracks with a genre
  // and then filter by BPM in a separate step
  const response = await fetch(`https://api.spotify.com/v1/search?q=genre:running&type=track&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${validSession.spotifyAccessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error("Spotify API error:", error)
    throw new Error(`Spotify API error: ${error.error?.message || response.statusText}`)
  }

  return response.json()
}

// Search for tracks by BPM range
export async function searchTracksByBpm(
  session: Session,
  minBpm: number,
  maxBpm: number,
  genres?: string[],
  limit = 20,
): Promise<SpotifyTrack[]> {
  try {
    const validSession = await getValidSpotifySession(session)

    // First, search for tracks by genre if provided
    let searchQuery = ""
    if (genres && genres.length > 0) {
      searchQuery = `genre:${genres.join(" OR genre:")}`
    } else {
      // Default to popular tracks if no genre is specified
      searchQuery = "year:2020-2023"
    }

    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${validSession.spotifyAccessToken}`,
        },
      },
    )

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => ({}))
      throw new SpotifyApiError(
        `Failed to search Spotify tracks: ${errorData.error?.message || searchResponse.statusText}`,
        searchResponse.status,
        errorData,
      )
    }

    const searchData = await searchResponse.json()

    if (!searchData.tracks || !searchData.tracks.items || searchData.tracks.items.length === 0) {
      return []
    }

    const trackIds = searchData.tracks.items.map((track: any) => track.id).join(",")

    // Then, get audio features for these tracks to filter by BPM
    const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
      headers: {
        Authorization: `Bearer ${validSession.spotifyAccessToken}`,
      },
    })

    if (!featuresResponse.ok) {
      const errorData = await featuresResponse.json().catch(() => ({}))
      throw new SpotifyApiError(
        `Failed to fetch audio features: ${errorData.error?.message || featuresResponse.statusText}`,
        featuresResponse.status,
        errorData,
      )
    }

    const featuresData = await featuresResponse.json()

    if (!featuresData.audio_features) {
      return []
    }

    // Filter tracks by BPM range
    const tracksWithinBpmRange = featuresData.audio_features
      .filter((features: SpotifyAudioFeatures) => features && features.tempo >= minBpm && features.tempo <= maxBpm)
      .map((features: SpotifyAudioFeatures) => features.id)

    // Return the filtered tracks
    return searchData.tracks.items
      .filter((track: SpotifyTrack) => tracksWithinBpmRange.includes(track.id))
      .slice(0, limit)
  } catch (error) {
    console.error("Error searching tracks by BPM:", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to search tracks by BPM: ${error.message || "Unknown error"}`, 500)
  }
}

// Get audio features for a track (including BPM)
export async function getAudioFeatures(session: Session, trackId: string): Promise<SpotifyAudioFeatures> {
  try {
    const validSession = await getValidSpotifySession(session)

    const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        Authorization: `Bearer ${validSession.spotifyAccessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new SpotifyApiError(
        `Failed to fetch audio features: ${errorData.error?.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching audio features:", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to fetch audio features: ${error.message || "Unknown error"}`, 500)
  }
}

// Generate a playlist based on route segments and BPM requirements
export async function generatePlaylistForRoute(
  session: Session,
  routeName: string,
  routeSegments: {
    name: string
    distanceRange: [number, number] // km
    bpmRange: [number, number]
    duration: number // minutes
  }[],
  genres?: string[],
): Promise<SpotifyPlaylist> {
  try {
    const validSession = await getValidSpotifySession(session)

    // Create a new playlist
    const playlist = await createSpotifyPlaylist(
      validSession,
      `PaceBeats: ${routeName}`,
      `Custom playlist for ${routeName} with pace-optimized BPM for each segment.`,
      false,
    )

    // For each segment, find tracks with matching BPM
    const allTrackUris: string[] = []

    for (const segment of routeSegments) {
      try {
        const tracks = await searchTracksByBpm(
          validSession,
          segment.bpmRange[0],
          segment.bpmRange[1],
          genres,
          5, // Get 5 tracks per segment
        )

        const trackUris = tracks.map((track) => `spotify:track:${track.id}`)
        allTrackUris.push(...trackUris)
      } catch (error) {
        console.error(`Error finding tracks for segment ${segment.name}:`, error)
        // Continue with other segments even if one fails
      }
    }

    // Add all tracks to the playlist
    if (allTrackUris.length > 0) {
      await addTracksToPlaylist(validSession, playlist.id, allTrackUris)
    } else {
      throw new SpotifyApiError("No suitable tracks found for the route segments", 404)
    }

    return playlist
  } catch (error) {
    console.error("Error generating playlist for route:", error)

    if (error instanceof SpotifyApiError) {
      throw error
    }

    throw new SpotifyApiError(`Failed to generate playlist for route: ${error.message || "Unknown error"}`, 500)
  }
}
