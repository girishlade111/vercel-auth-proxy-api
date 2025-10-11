import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getStravaRoute, getStravaRouteStreams, StravaApiError } from "@/lib/strava"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated with Strava" }, { status: 401 })
    }

    const routeId = Number.parseInt(params.id, 10)
    if (isNaN(routeId)) {
      return NextResponse.json({ error: "Invalid route ID" }, { status: 400 })
    }

    // Get the route details
    const route = await getStravaRoute(session, routeId)

    // Get the route streams (detailed data for visualization)
    let streams = null
    try {
      streams = await getStravaRouteStreams(session, routeId)
    } catch (error) {
      console.error("Error fetching route streams:", error)
      // Continue even if streams fail - we'll still return the route data
    }

    // Get the map image URL
    let mapUrl = null
    if (route.map?.summary_polyline) {
      const mapResponse = await fetch(
        `${request.nextUrl.origin}/api/maps/static?polyline=${encodeURIComponent(route.map.summary_polyline)}`,
        { method: "GET" },
      )
      if (mapResponse.ok) {
        const mapData = await mapResponse.json()
        mapUrl = mapData.mapUrl
      }
    }

    return NextResponse.json({
      success: true,
      route,
      streams,
      mapUrl,
    })
  } catch (error) {
    console.error("Error fetching Strava route:", error)

    if (error instanceof StravaApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
