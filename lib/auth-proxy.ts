import type { Session } from "next-auth"

const PROXY_BASE_URL = "https://auth.runnershigh.uk"

/**
 * Helper function to make authenticated requests through the proxy
 */
export async function proxyFetch(endpoint: string, session: Session, options: RequestInit = {}): Promise<Response> {
  const token = endpoint.includes("/spotify/") ? session.spotifyAccessToken : session.accessToken

  if (!token) {
    throw new Error(`No token available for endpoint: ${endpoint}`)
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  return fetch(`${PROXY_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
}

/**
 * Check if the auth proxy is available
 */
export async function checkProxyHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${PROXY_BASE_URL}/api/healthcheck`)
    return response.ok
  } catch (error) {
    console.error("Auth proxy health check failed:", error)
    return false
  }
}

/**
 * Get the current session from the proxy
 */
export async function getProxySession(sessionToken: string): Promise<any> {
  try {
    const response = await fetch(`${PROXY_BASE_URL}/api/auth/session`, {
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

/**
 * Get the current site URL for callbacks
 */
export function getCurrentSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // Server-side fallback
  return process.env.NEXTAUTH_URL || "http://localhost:3000"
}

/**
 * Create a properly formatted callback URL
 */
export function createCallbackUrl(path = "/dashboard"): string {
  const baseUrl = getCurrentSiteUrl()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}
