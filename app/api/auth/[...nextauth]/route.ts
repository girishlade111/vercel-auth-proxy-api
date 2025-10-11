import NextAuth from "next-auth"
import StravaProvider from "next-auth/providers/strava"
import SpotifyProvider from "next-auth/providers/spotify"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

// For debugging
console.log("NextAuth configuration loading")

// Check if API credentials are available
const hasStravaCredentials = !!(process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_SECRET)
const hasSpotifyCredentials = !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)

// Log environment variables (without exposing secrets)
console.log("Environment check:", {
  hasStravaCredentials,
  hasSpotifyCredentials,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set",
  NODE_ENV: process.env.NODE_ENV,
})

// Build providers array based on available credentials
const providers = []

// Add Credentials provider for demo mode
providers.push(
  CredentialsProvider({
    name: "Demo Mode",
    credentials: {
      username: { label: "Username", type: "text", placeholder: "demo" },
    },
    async authorize() {
      // Return a mock user for demo purposes
      return {
        id: "demo-user",
        name: "Demo User",
        email: "demo@example.com",
        image: "https://avatars.githubusercontent.com/u/1?v=4",
      }
    },
  }),
)

// Add Strava provider if credentials are available
if (hasStravaCredentials) {
  providers.push(
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID ?? "",
      clientSecret: process.env.STRAVA_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "read,activity:read_all,profile:read_all,read_all",
        },
      },
    }),
  )
}

// Add Spotify provider if credentials are available
if (hasSpotifyCredentials) {
  // Use direct URL for Spotify authorization instead of proxy
  providers.push(
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
    }),
  )
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        console.log("JWT callback - initial sign in", { provider: account.provider })

        if (account.provider === "strava") {
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
          token.expiresAt = account.expires_at
          token.stravaId = account.providerAccountId
        }

        if (account.provider === "spotify") {
          console.log("Setting Spotify tokens in JWT")
          token.spotifyAccessToken = account.access_token
          token.spotifyRefreshToken = account.refresh_token
          token.spotifyExpiresAt = Math.floor(Date.now() / 1000 + (account.expires_in || 3600))
          token.spotifyId = account.providerAccountId
        }

        if (account.provider === "credentials") {
          // Set mock tokens for demo mode
          token.accessToken = "demo-strava-token"
          token.refreshToken = "demo-strava-refresh"
          token.expiresAt = Math.floor(Date.now() / 1000) + 3600
          token.spotifyAccessToken = "demo-spotify-token"
          token.spotifyRefreshToken = "demo-spotify-refresh"
          token.spotifyExpiresAt = Math.floor(Date.now() / 1000) + 3600
        }

        return token
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.expiresAt = token.expiresAt as number
        session.spotifyAccessToken = token.spotifyAccessToken as string
        session.spotifyRefreshToken = token.spotifyRefreshToken as string
        session.spotifyExpiresAt = token.spotifyExpiresAt as number

        // Add user IDs from providers
        session.user.stravaId = token.stravaId as string
        session.user.spotifyId = token.spotifyId as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Log redirect attempts for debugging
      console.log("Redirect callback:", { url, baseUrl })

      // Use relative URL for redirects to avoid domain issues
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  // Configure cookie settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: ".runnershigh.uk", // Use the root domain
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: ".runnershigh.uk", // Use the root domain
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: ".runnershigh.uk", // Use the root domain
      },
    },
  },
}

// Function to refresh Strava access token
async function refreshStravaAccessToken(refreshToken: string) {
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
    throw new Error("Missing Strava API credentials")
  }

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Strava token refresh failed:", errorData)
    throw new Error(`Strava token refresh failed: ${errorData.message || response.statusText}`)
  }

  return await response.json()
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
