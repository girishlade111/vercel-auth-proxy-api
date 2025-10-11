import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { generatePlaylistForRoute } from "@/lib/spotify"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.spotifyAccessToken) {
      return NextResponse.json({ error: "Not authenticated with Spotify" }, { status: 401 })
    }

    const body = await request.json()
    const { routeName, routeSegments, genres } = body

    if (!routeName || !routeSegments || !Array.isArray(routeSegments) || routeSegments.length === 0) {
      return NextResponse.json({ error: "Invalid route data" }, { status: 400 })
    }

    const playlist = await generatePlaylistForRoute(session, routeName, routeSegments, genres)

    return NextResponse.json({ playlist })
  } catch (error) {
    console.error("Error generating playlist for route:", error)
    return NextResponse.json({ error: "Failed to generate playlist for route" }, { status: 500 })
  }
}
