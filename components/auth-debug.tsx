"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthDebug() {
  const { data: session, status, update } = useSession()
  const [isExpanded, setIsExpanded] = useState(false)

  if (status === "loading") {
    return <div>Loading authentication status...</div>
  }

  const now = Math.floor(Date.now() / 1000)
  const stravaExpiresIn = session?.expiresAt ? session.expiresAt - now : null
  const spotifyExpiresIn = session?.spotifyExpiresAt ? session.spotifyExpiresAt - now : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
        <CardDescription>Current authentication status and token information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={status === "authenticated" ? "text-green-500" : "text-red-500"}>{status}</span>
          </div>

          <div className="flex justify-between">
            <span>Strava:</span>
            <span className={session?.accessToken ? "text-green-500" : "text-red-500"}>
              {session?.accessToken ? "Connected" : "Not connected"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Spotify:</span>
            <span className={session?.spotifyAccessToken ? "text-green-500" : "text-red-500"}>
              {session?.spotifyAccessToken ? "Connected" : "Not connected"}
            </span>
          </div>

          {session?.error && (
            <div className="flex justify-between text-red-500">
              <span>Error:</span>
              <span>{session.error}</span>
            </div>
          )}

          {isExpanded && (
            <>
              {stravaExpiresIn !== null && (
                <div className="flex justify-between">
                  <span>Strava token expires in:</span>
                  <span className={stravaExpiresIn <= 0 ? "text-red-500" : "text-green-500"}>
                    {stravaExpiresIn <= 0 ? "Expired" : `${Math.floor(stravaExpiresIn / 60)} minutes`}
                  </span>
                </div>
              )}

              {spotifyExpiresIn !== null && (
                <div className="flex justify-between">
                  <span>Spotify token expires in:</span>
                  <span className={spotifyExpiresIn <= 0 ? "text-red-500" : "text-green-500"}>
                    {spotifyExpiresIn <= 0 ? "Expired" : `${Math.floor(spotifyExpiresIn / 60)} minutes`}
                  </span>
                </div>
              )}

              <div className="pt-2">
                <Button size="sm" onClick={() => update()}>
                  Refresh Session
                </Button>
              </div>
            </>
          )}

          <Button variant="link" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
