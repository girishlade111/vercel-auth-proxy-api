import "next-auth"

declare module "next-auth" {
  interface Session {
    // Spotify-specific fields
    spotifyAccessToken: string
    spotifyRefreshToken: string
    spotifyExpiresAt: number
    spotifyError?: string

    // User fields
    user: {
      spotifyId?: string
      [key: string]: any
    }

    // Other fields that might be needed
    [key: string]: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // Spotify-specific fields
    spotifyAccessToken?: string
    spotifyRefreshToken?: string
    spotifyExpiresAt?: number
    spotifyId?: string
    spotifyError?: string

    // Other fields that might be needed
    [key: string]: any
  }
}
