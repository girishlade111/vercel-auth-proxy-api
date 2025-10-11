"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AuthDebugPage() {
  const { data: session, status, update } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [spotifyTestResult, setSpotifyTestResult] = useState<{
    success: boolean
    message: string
    data?: any
    error?: any
  } | null>(null)
  const [isTestingSpotify, setIsTestingSpotify] = useState(false)

  const handleRefreshSession = async () => {
    setIsRefreshing(true)
    try {
      await update()
      toast({
        title: "Session Refreshed",
        description: "Your authentication session has been refreshed.",
      })
    } catch (error) {
      console.error("Error refreshing session:", error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh your session. Please try signing in again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const testSpotifyConnection = async () => {
    setIsTestingSpotify(true)
    try {
      const response = await fetch("/api/admin/test-spotify-connection")
      const data = await response.json()

      setSpotifyTestResult({
        success: response.ok,
        message: data.message || "Test completed",
        data: data.data,
        error: data.error,
      })

      if (response.ok) {
        toast({
          title: "Spotify Connection Test Successful",
          description: data.message || "Successfully connected to Spotify API",
        })
      } else {
        toast({
          title: "Spotify Connection Test Failed",
          description: data.error || "Failed to connect to Spotify API",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error testing Spotify connection:", error)
      setSpotifyTestResult({
        success: false,
        message: "Error testing Spotify connection",
        error: error.message,
      })
      toast({
        title: "Test Failed",
        description: "An error occurred while testing the Spotify connection.",
        variant: "destructive",
      })
    } finally {
      setIsTestingSpotify(false)
    }
  }

  // Calculate token expiration times
  const now = Math.floor(Date.now() / 1000)
  const spotifyExpiresIn = session?.spotifyExpiresAt ? session.spotifyExpiresAt - now : null
  const stravaExpiresIn = session?.expiresAt ? session.expiresAt - now : null

  // Format expiration time
  const formatExpiresIn = (expiresIn: number | null) => {
    if (expiresIn === null) return "Unknown"
    if (expiresIn <= 0) return "Expired"

    const minutes = Math.floor(expiresIn / 60)
    const seconds = expiresIn % 60

    if (minutes > 60) {
      const hours = Math.floor(minutes / 60)
      return `${hours}h ${minutes % 60}m`
    }

    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              Current authentication status: <strong>{status.toUpperCase()}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "authenticated" ? (
              <div className="space-y-4">
                <Alert
                  variant="success"
                  className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
                >
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Authenticated</AlertTitle>
                  <AlertDescription>You are signed in as {session?.user?.name || "Unknown User"}</AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Spotify Status</h3>
                    {session?.spotifyAccessToken ? (
                      <Alert variant={spotifyExpiresIn && spotifyExpiresIn > 0 ? "default" : "destructive"}>
                        {spotifyExpiresIn && spotifyExpiresIn > 0 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {spotifyExpiresIn && spotifyExpiresIn > 0 ? "Connected" : "Token Expired"}
                        </AlertTitle>
                        <AlertDescription>
                          {spotifyExpiresIn && spotifyExpiresIn > 0
                            ? `Token expires in ${formatExpiresIn(spotifyExpiresIn)}`
                            : "Your Spotify token has expired. Please refresh the session."}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Not Connected</AlertTitle>
                        <AlertDescription>No Spotify access token found. Please sign in with Spotify.</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Strava Status</h3>
                    {session?.accessToken ? (
                      <Alert variant={stravaExpiresIn && stravaExpiresIn > 0 ? "default" : "destructive"}>
                        {stravaExpiresIn && stravaExpiresIn > 0 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {stravaExpiresIn && stravaExpiresIn > 0 ? "Connected" : "Token Expired"}
                        </AlertTitle>
                        <AlertDescription>
                          {stravaExpiresIn && stravaExpiresIn > 0
                            ? `Token expires in ${formatExpiresIn(stravaExpiresIn)}`
                            : "Your Strava token has expired. Please refresh the session."}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Not Connected</AlertTitle>
                        <AlertDescription>No Strava access token found. Please sign in with Strava.</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Spotify Connection Test</h3>
                  <div className="flex space-x-2">
                    <Button onClick={testSpotifyConnection} disabled={isTestingSpotify || !session?.spotifyAccessToken}>
                      {isTestingSpotify ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        "Test Spotify Connection"
                      )}
                    </Button>
                    <Button onClick={handleRefreshSession} disabled={isRefreshing}>
                      {isRefreshing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        "Refresh Session"
                      )}
                    </Button>
                  </div>

                  {spotifyTestResult && (
                    <Alert variant={spotifyTestResult.success ? "default" : "destructive"} className="mt-4">
                      {spotifyTestResult.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>{spotifyTestResult.success ? "Success" : "Error"}</AlertTitle>
                      <AlertDescription>{spotifyTestResult.message}</AlertDescription>

                      {spotifyTestResult.data && (
                        <div className="mt-2 p-2 bg-muted rounded-md overflow-auto max-h-40">
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(spotifyTestResult.data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {spotifyTestResult.error && (
                        <div className="mt-2 p-2 bg-destructive/10 rounded-md overflow-auto max-h-40">
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(spotifyTestResult.error, null, 2)}
                          </pre>
                        </div>
                      )}
                    </Alert>
                  )}
                </div>
              </div>
            ) : status === "loading" ? (
              <Alert>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertTitle>Loading</AlertTitle>
                <AlertDescription>Checking authentication status...</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Authenticated</AlertTitle>
                <AlertDescription>
                  You are not signed in. Please sign in to access authentication debug features.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {status === "authenticated" && (
          <Card>
            <CardHeader>
              <CardTitle>Session Data</CardTitle>
              <CardDescription>Raw session data for debugging</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="session">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="session">Session</TabsTrigger>
                  <TabsTrigger value="spotify">Spotify</TabsTrigger>
                  <TabsTrigger value="strava">Strava</TabsTrigger>
                </TabsList>

                <TabsContent value="session" className="mt-4">
                  <div className="p-2 bg-muted rounded-md overflow-auto max-h-96">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
                  </div>
                </TabsContent>

                <TabsContent value="spotify" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Spotify Access Token</h3>
                      <div className="p-2 bg-muted rounded-md overflow-x-auto">
                        <code className="text-xs break-all">{session?.spotifyAccessToken || "Not available"}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Spotify Refresh Token</h3>
                      <div className="p-2 bg-muted rounded-md overflow-x-auto">
                        <code className="text-xs break-all">{session?.spotifyRefreshToken || "Not available"}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Spotify Expires At</h3>
                      <div className="p-2 bg-muted rounded-md overflow-x-auto">
                        <code className="text-xs">
                          {session?.spotifyExpiresAt
                            ? `${session.spotifyExpiresAt} (${new Date(
                                session.spotifyExpiresAt * 1000,
                              ).toLocaleString()})`
                            : "Not available"}
                        </code>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="strava" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Strava Access Token</h3>
                      <div className="p-2 bg-muted rounded-md overflow-x-auto">
                        <code className="text-xs break-all">{session?.accessToken || "Not available"}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Strava Refresh Token</h3>
                      <div className="p-2 bg-muted rounded-md overflow-x-auto">
                        <code className="text-xs break-all">{session?.refreshToken || "Not available"}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Strava Expires At</h3>
                      <div className="p-2 bg-muted rounded-md overflow-x-auto">
                        <code className="text-xs">
                          {session?.expiresAt
                            ? `${session.expiresAt} (${new Date(session.expiresAt * 1000).toLocaleString()})`
                            : "Not available"}
                        </code>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
