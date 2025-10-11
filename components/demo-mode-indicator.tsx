"use client"

import { useSession } from "next-auth/react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DemoModeIndicator() {
  const { data: session } = useSession()

  // Check if we're in demo mode
  const isDemoMode = session?.accessToken === "demo-strava-token"

  if (!isDemoMode) return null

  return (
    <Alert variant="info" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Demo Mode Active</AlertTitle>
      <AlertDescription>
        You're using the app in demo mode with simulated data. To use real data, connect your Strava and Spotify
        accounts.
      </AlertDescription>
    </Alert>
  )
}
