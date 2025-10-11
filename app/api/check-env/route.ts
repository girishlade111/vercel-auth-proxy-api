import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    nextauthUrl: process.env.NEXTAUTH_URL,
    // Don't include sensitive information like secrets
    // This is just for debugging
  })
}
