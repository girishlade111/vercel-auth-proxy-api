import { NextResponse } from "next/server"
import { mockRoutes } from "@/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json({ routes: mockRoutes })
  } catch (error) {
    console.error("Error fetching routes:", error)
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 })
  }
}
