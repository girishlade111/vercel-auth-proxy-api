"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

export function AuthDebugPanel() {
  const { data: session, status, update } = useSession()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  if (status === "loading") {
    return (
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checking Authentication Status</AlertTitle>
        <AlertDescription>Verifying your authentication status...</AlertDescription>
      </Alert>
    )
  }

  const isAuthenticated = status === "authenticated"
  const hasSpotifyToken = !!session?.spotifyAccessToken
  const hasStravaToken = !!session?.accessToken

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

  // Determine token status
  const getTokenStatus = (expiresIn: number | null) => {
    if (expiresIn === null) return "unknown"
    if (expiresIn <= 0) return "expired"
    if (expiresIn < 300) return "expiring-soon" // Less than 5 minutes
    return "valid"
  }

  const spotifyStatus = getTokenStatus(spotifyExpiresIn)
  const stravaStatus = getTokenStatus(stravaExpiresIn)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Authentication Status</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        <CardDescription>
          {isAuthenticated
            ? `Signed in as ${session?.user?.name || "Unknown User"}`
            : "Not signed in. Please sign in to access all features."}
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="pt-2">
            <Tabs defaultValue="status">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="session">Session Data</TabsTrigger>
              </TabsList>

              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Spotify</div>
                    <div className="flex items-center">
                      {hasSpotifyToken ? (
                        <Badge
                          variant="outline"
                          className={
                            spotifyStatus === "valid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : spotifyStatus === "expiring-soon"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }
                        >
                          {spotifyStatus === "valid"
                            ? "Connected"
                            : spotifyStatus === "expiring-soon"
                              ? "Expiring Soon"
                              : "Expired"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                          Not Connected
                        </Badge>
                      )}
                      {hasSpotifyToken && spotifyExpiresIn !== null && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Expires in {formatExpiresIn(spotifyExpiresIn)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Strava</div>
                    <div className="flex items-center">
                      {hasStravaToken ? (
                        <Badge
                          variant="outline"
                          className={
                            stravaStatus === "valid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : stravaStatus === "expiring-soon"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }
                        >
                          {stravaStatus === "valid"
                            ? "Connected"
                            : stravaStatus === "expiring-soon"
                              ? "Expiring Soon"
                              : "Expired"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                          Not Connected
                        </Badge>
                      )}
                      {hasStravaToken && stravaExpiresIn !== null && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Expires in {formatExpiresIn(stravaExpiresIn)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {session?.error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>{session.error}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="tokens" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Spotify Access Token</div>
                    <div className="p-2 bg-muted rounded-md overflow-x-auto">
                      <code className="text-xs">
                        {session?.spotifyAccessToken
                          ? `${session.spotifyAccessToken.substring(0, 20)}...`
                          : "Not available"}
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Strava Access Token</div>
                    <div className="p-2 bg-muted rounded-md overflow-x-auto">
                      <code className="text-xs">
                        {session?.accessToken ? `${session.accessToken.substring(0, 20)}...` : "Not available"}
                      </code>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="session" className="pt-4">
                <div className="p-2 bg-muted rounded-md overflow-auto max-h-60">
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" onClick={handleRefreshSession} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Session
                    </>
                  )}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  )
}
