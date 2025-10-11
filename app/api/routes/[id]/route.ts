import { NextResponse } from "next/server"
import { detailedRoutes } from "@/lib/mock-data"
import { calculateSegmentBpms, calculateEstimatedTime, generatePlaylistStructure } from "@/lib/bpm-calculator"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const routeId = params.id

    // Find the requested route
    const route = detailedRoutes.find((r) => r.id === routeId)

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    // Get target pace from query params if provided
    const { searchParams } = new URL(request.url)
    const targetPaceParam = searchParams.get("targetPace")
    const targetPace = targetPaceParam ? Number.parseFloat(targetPaceParam) : undefined

    // Calculate BPMs for each segment
    const routeWithBpms = calculateSegmentBpms(route, targetPace)

    // Calculate estimated completion time
    const estimatedTimeMinutes = calculateEstimatedTime(routeWithBpms, targetPace)

    // Generate playlist structure
    const playlistStructure = generatePlaylistStructure(routeWithBpms)

    return NextResponse.json({
      route: routeWithBpms,
      estimatedTimeMinutes,
      playlistStructure,
    })
  } catch (error) {
    console.error("Error fetching route details:", error)
    return NextResponse.json({ error: "Failed to fetch route details" }, { status: 500 })
  }
}
