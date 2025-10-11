"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StravaTestResponse {
  success: boolean
  message: string
  athlete?: {
    id: number
    firstname: string
    lastname: string
    profile: string
    city?: string
    country?: string
  }
  error?: string
}

export function StravaTest() {
  const { data: session, status } = useSession()
  const [testResult, setTestResult] = useState<StravaTestResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testStravaApi = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/strava/test")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      console.error("Error testing Strava API:", error)
      setTestResult({
        success: false,
        message: "Failed to test Strava API",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format timestamp to readable date/time
  const formatExpiryTime = (timestamp: number) => {
    if (!timestamp) return "Unknown"
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  // Calculate time until expiry
  const getTimeUntilExpiry = (timestamp: number) => {
    if (!timestamp) return "Unknown"
    const now = Math.floor(Date.now() / 1000)
    const secondsRemaining = timestamp - now

    if (secondsRemaining <= 0) return "Expired"

    const minutes = Math.floor(secondsRemaining / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`
    }
    return `${minutes}m remaining`
  }

  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strava Connection Test</CardTitle>
          <CardDescription>Loading session information...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (status === "unauthenticated" || !session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strava Connection Test</CardTitle>
          <CardDescription>You need to sign in to test your Strava connection.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strava Connection Test</CardTitle>
        <CardDescription>Test your Strava API connection and view token status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${session.accessToken ? "bg-green-500" : "bg-red-500"}`} />
              <span className="font-medium">Strava Connection</span>
            </div>
            <span>{session.accessToken ? "Connected" : "Not Connected"}</span>
          </div>

          {session.expiresAt && (
            <div className="mt-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Token Expires:</span>
                <span>{formatExpiryTime(session.expiresAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span>{getTimeUntilExpiry(session.expiresAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Test Results */}
        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {testResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
            </div>
            <AlertDescription>{testResult.message}</AlertDescription>

            {testResult.athlete && (
              <div className="mt-4 rounded-md bg-background p-4">
                <div className="flex items-center gap-4">
                  {testResult.athlete.profile && (
                    <img
                      src={testResult.athlete.profile || "/placeholder.svg"}
                      alt="Athlete profile"
                      className="h-12 w-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {testResult.athlete.firstname} {testResult.athlete.lastname}
                    </p>
                    {testResult.athlete.city && testResult.athlete.country && (
                      <p className="text-sm text-muted-foreground">
                        {testResult.athlete.city}, {testResult.athlete.country}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">ID: {testResult.athlete.id}</p>
                  </div>
                </div>
              </div>
            )}

            {testResult.error && (
              <div className="mt-2 text-sm">
                <p className="font-medium">Error details:</p>
                <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-background p-2 text-xs">
                  {testResult.error}
                </pre>
              </div>
            )}
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testStravaApi} disabled={isLoading || !session.accessToken} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Strava API"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
