"use client"

import { Music, Route } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ConnectAccountsProps {
  isConnected: {
    strava: boolean
    spotify: boolean
  }
}

export function ConnectAccounts({ isConnected: initialIsConnected }: ConnectAccountsProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(initialIsConnected)
  const [isLoading, setIsLoading] = useState({
    strava: false,
    spotify: false,
  })

  // Check if we're in demo mode
  const isDemoMode = session?.accessToken === "demo-strava-token"

  const handleStravaConnect = async () => {
    if (isDemoMode) {
      // In demo mode, just pretend we connected
      setIsConnected({ ...isConnected, strava: true })
      return
    }

    setIsLoading({ ...isLoading, strava: true })
    try {
      await signIn("strava", { callbackUrl: "/dashboard" })
      setIsConnected({ ...isConnected, strava: true })
    } catch (error) {
      console.error("Error connecting to Strava:", error)
    } finally {
      setIsLoading({ ...isLoading, strava: false })
    }
  }

  const handleSpotifyConnect = async () => {
    if (isDemoMode) {
      // In demo mode, just pretend we connected
      setIsConnected({ ...isConnected, spotify: true })
      return
    }

    setIsLoading({ ...isLoading, spotify: true })
    try {
      await signIn("spotify", { callbackUrl: "/dashboard" })
      setIsConnected({ ...isConnected, spotify: true })
    } catch (error) {
      console.error("Error connecting to Spotify:", error)
    } finally {
      setIsLoading({ ...isLoading, spotify: false })
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  // Check if connected based on session
  const isStravaConnected = isDemoMode || !!session?.accessToken
  const isSpotifyConnected = isDemoMode || !!session?.spotifyAccessToken

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Connect Your Accounts</CardTitle>
        <CardDescription>
          Connect your Strava and Spotify accounts to create pace-optimized playlists for your runs.
        </CardDescription>
        {isDemoMode && (
          <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
            <p className="text-sm">
              <strong>Demo Mode:</strong> You're using the app in demo mode. API connections are simulated.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Route className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">Strava</p>
              <p className="text-xs text-muted-foreground">Connect to access your routes</p>
            </div>
          </div>
          <Button
            variant={isStravaConnected ? "outline" : "default"}
            onClick={handleStravaConnect}
            disabled={isLoading.strava || isStravaConnected}
          >
            {isLoading.strava ? "Connecting..." : isStravaConnected ? "Connected" : "Connect"}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Music className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Spotify</p>
              <p className="text-xs text-muted-foreground">Connect to create playlists</p>
            </div>
          </div>
          <Button
            variant={isSpotifyConnected ? "outline" : "default"}
            onClick={handleSpotifyConnect}
            disabled={isLoading.spotify || isSpotifyConnected}
          >
            {isLoading.spotify ? "Connecting..." : isSpotifyConnected ? "Connected" : "Connect"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!(isStravaConnected || isSpotifyConnected)} onClick={handleContinue}>
          Continue to Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}
