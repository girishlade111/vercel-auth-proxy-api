/**
 * Utility to validate environment variables
 */
export function validateEnv() {
  const requiredVars = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "STRAVA_CLIENT_ID",
    "STRAVA_CLIENT_SECRET",
    "SPOTIFY_CLIENT_ID",
    "SPOTIFY_CLIENT_SECRET",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`)
    return false
  }

  // Validate URL format
  if (!process.env.NEXTAUTH_URL?.startsWith("http")) {
    console.error(`Invalid NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}. Must start with http:// or https://`)
    return false
  }

  // Validate client IDs format (they should be numeric for Strava and alphanumeric for Spotify)
  if (!/^\d+$/.test(process.env.STRAVA_CLIENT_ID || "")) {
    console.error("Invalid STRAVA_CLIENT_ID format. Should be numeric.")
    return false
  }

  if (!/^[a-zA-Z0-9]+$/.test(process.env.SPOTIFY_CLIENT_ID || "")) {
    console.error("Invalid SPOTIFY_CLIENT_ID format. Should be alphanumeric.")
    return false
  }

  return true
}
