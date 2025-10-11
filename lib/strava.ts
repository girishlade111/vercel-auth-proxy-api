import type { Session } from "next-auth"

export interface StravaAthlete {
  id: number
  username: string
  firstname: string
  lastname: string
  city: string
  country: string
  profile: string
  profile_medium: string
}

export interface StravaActivity {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  start_date: string
  start_date_local: string
  timezone: string
  start_latlng: [number, number]
  end_latlng: [number, number]
  map: {
    id: string
    summary_polyline: string
    polyline: string
  }
}

export interface StravaRoute {
  id: number
  name: string
  description: string
  distance: number
  elevation_gain: number
  type: number
  sub_type: number
  created_at: string
  map: {
    id: string
    summary_polyline: string
    polyline: string
  }
}

// Error class for Strava API errors
export class StravaApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "StravaApiError"
    this.status = status
    this.data = data
  }
}

// Function to refresh the Strava access token if it's expired
export async function refreshStravaToken(session: Session): Promise<Session> {
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
    throw new StravaApiError("Missing Strava API credentials in environment variables", 500)
  }

  if (!session.refreshToken) {
    throw new StravaApiError("No Strava refresh token available", 401)
  }

  try {
    console.log("Refreshing Strava token...")

    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: session.refreshToken,
      }).toString(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Strava token refresh failed:", errorData)
      throw new StravaApiError(
        `Strava token refresh failed: ${errorData.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    const refreshedTokens = await response.json()

    // Update the session with new tokens
    const updatedSession = {
      ...session,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token,
      expiresAt: refreshedTokens.expires_at,
    }

    // If this is running on the client, update the session
    if (typeof window !== "undefined") {
      const event = new Event("visibilitychange")
      document.dispatchEvent(event)
    }

    return updatedSession
  } catch (error) {
    console.error("Error refreshing Strava access token", error)

    if (error instanceof StravaApiError) {
      throw error
    }

    throw new StravaApiError(`Failed to refresh Strava token: ${error.message || "Unknown error"}`, 500)
  }
}

// Check if the Strava token needs to be refreshed
export async function getValidStravaSession(session: Session): Promise<Session> {
  if (!session?.accessToken) {
    throw new StravaApiError("No Strava access token available", 401)
  }

  // If the token is expired or will expire in the next 5 minutes, refresh it
  const fiveMinutesInSeconds = 5 * 60
  if (session.expiresAt && session.expiresAt - Math.floor(Date.now() / 1000) < fiveMinutesInSeconds) {
    console.log("Strava token expired or expiring soon, refreshing...")
    return refreshStravaToken(session)
  }

  return session
}

// Get the current athlete's profile
export async function getStravaProfile(session: Session): Promise<StravaAthlete> {
  try {
    const validSession = await getValidStravaSession(session)

    const response = await fetch("https://www.strava.com/api/v3/athlete", {
      headers: {
        Authorization: `Bearer ${validSession.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new StravaApiError(
        `Failed to fetch Strava profile: ${errorData.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Strava profile:", error)

    if (error instanceof StravaApiError) {
      throw error
    }

    throw new StravaApiError(`Failed to fetch Strava profile: ${error.message || "Unknown error"}`, 500)
  }
}

// Get the athlete's activities
export async function getStravaActivities(session: Session, limit = 20, page = 1): Promise<StravaActivity[]> {
  try {
    const validSession = await getValidStravaSession(session)

    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${limit}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${validSession.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new StravaApiError(
        `Failed to fetch Strava activities: ${errorData.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Strava activities:", error)

    if (error instanceof StravaApiError) {
      throw error
    }

    throw new StravaApiError(`Failed to fetch Strava activities: ${error.message || "Unknown error"}`, 500)
  }
}

// Get a specific activity
export async function getStravaActivity(session: Session, activityId: number): Promise<StravaActivity> {
  try {
    const validSession = await getValidStravaSession(session)

    const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${validSession.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new StravaApiError(
        `Failed to fetch Strava activity: ${errorData.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Strava activity:", error)

    if (error instanceof StravaApiError) {
      throw error
    }

    throw new StravaApiError(`Failed to fetch Strava activity: ${error.message || "Unknown error"}`, 500)
  }
}

// Get the athlete's routes
export async function getStravaRoutes(session: Session): Promise<StravaRoute[]> {
  try {
    const validSession = await getValidStravaSession(session)

    if (!session.user.stravaId) {
      throw new StravaApiError("No Strava user ID available", 400)
    }

    const response = await fetch(`https://www.strava.com/api/v3/athletes/${session.user.stravaId}/routes`, {
      headers: {
        Authorization: `Bearer ${validSession.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new StravaApiError(
        `Failed to fetch Strava routes: ${errorData.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Strava routes:", error)

    if (error instanceof StravaApiError) {
      throw error
    }

    throw new StravaApiError(`Failed to fetch Strava routes: ${error.message || "Unknown error"}`, 500)
  }
}

// Get a specific route
export async function getStravaRoute(session: Session, routeId: number): Promise<StravaRoute> {
  try {
    const validSession = await getValidStravaSession(session)

    const response = await fetch(`https://www.strava.com/api/v3/routes/${routeId}`, {
      headers: {
        Authorization: `Bearer ${validSession.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new StravaApiError(
        `Failed to fetch Strava route: ${errorData.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Strava route:", error)

    if (error instanceof StravaApiError) {
      throw error
    }

    throw new StravaApiError(`Failed to fetch Strava route: ${error.message || "Unknown error"}`, 500)
  }
}

// Get route streams (detailed data for visualization)
export async function getStravaRouteStreams(session: Session, routeId: number): Promise<any> {
  try {
    const validSession = await getValidStravaSession(session)

    const response = await fetch(`https://www.strava.com/api/v3/routes/${routeId}/streams`, {
      headers: {
        Authorization: `Bearer ${validSession.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new StravaApiError(
        `Failed to fetch Strava route streams: ${errorData.message || response.statusText}`,
        response.status,
        errorData,
      )
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching Strava route streams:", error)

    if (error instanceof StravaApiError) {
      throw error
    }

    throw new StravaApiError(`Failed to fetch Strava route streams: ${error.message || "Unknown error"}`, 500)
  }
}
