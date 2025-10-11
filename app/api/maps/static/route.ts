import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  // Verify user is authenticated
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the polyline from the query params
  const searchParams = request.nextUrl.searchParams
  const polyline = searchParams.get("polyline")

  if (!polyline) {
    return NextResponse.json({ error: "Missing polyline parameter" }, { status: 400 })
  }

  // Generate the map URL on the server side using the server-only environment variable
  // Note: We're using GOOGLE_MAPS_API_KEY (without NEXT_PUBLIC_ prefix)
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=400x200&path=enc:${encodeURIComponent(polyline)}&key=${process.env.GOOGLE_MAPS_API_KEY}`

  // Return the URL
  return NextResponse.json({ mapUrl })
}
