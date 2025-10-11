"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StravaReconnect } from "@/components/strava-reconnect"

export default function StravaDebugPage() {
  const { data: session, status, update } = useSession()
  const [envStatus, setEnvStatus] = useState<{
    stravaClientId: string
    stravaClientSecret: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkEnvironmentVariables = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/check-strava-env")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error("Error checking environment variables:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold">Strava Integration Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Check if your Strava API credentials are properly loaded.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkEnvironmentVariables} disabled={isLoading}>
            {isLoading ? "Checking..." : "Check Environment Variables"}
          </Button>

          {envStatus && (
            <div className="p-4 border rounded-md bg-muted">
              <p>Strava Client ID: {envStatus.stravaClientId}</p>
              <p>Strava Client Secret: {envStatus.stravaClientSecret}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strava Session</CardTitle>
          <CardDescription>Current Strava authentication status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" ? (
            <p>Loading session...</p>
          ) : session?.accessToken ? (
            <div className="space-y-2">
              <p className="text-green-600">✓ Authenticated with Strava</p>
              <p>Access Token: {session.accessToken.substring(0, 10)}...</p>
              {session.expiresAt && <p>Expires: {new Date(session.expiresAt * 1000).toLocaleString()}</p>}
            </div>
          ) : (
            <p className="text-red-600">✗ Not authenticated with Strava</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reconnect Strava</CardTitle>
          <CardDescription>Force a new authentication with Strava.</CardDescription>
        </CardHeader>
        <CardContent>
          <StravaReconnect />
        </CardContent>
      </Card>
    </div>
  )
}
