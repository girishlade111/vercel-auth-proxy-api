"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, Music, AlertCircle, CheckCircle } from "lucide-react"

export function SpotifyTest() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: any
    error?: string
  } | null>(null)

  const testSpotifyAPI = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/spotify/test")
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Successfully connected to Spotify API",
          data,
        })
      } else {
        setResult({
          success: false,
          message: "Failed to connect to Spotify API",
          error: data.error || "Unknown error",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error testing Spotify API",
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate token expiration time
  const now = Math.floor(Date.now() / 1000)
  const spotifyExpiresIn = session?.spotifyExpiresAt ? session.spotifyExpiresAt - now : null

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Spotify API Test
        </CardTitle>
        <CardDescription>Test your Spotify API connection</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "authenticated" ? (
          <>
            {session?.spotifyAccessToken ? (
              <Alert variant={spotifyExpiresIn && spotifyExpiresIn > 0 ? "default" : "destructive"}>
                {spotifyExpiresIn && spotifyExpiresIn > 0 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{spotifyExpiresIn && spotifyExpiresIn > 0 ? "Connected" : "Token Expired"}</AlertTitle>
                <AlertDescription>
                  {spotifyExpiresIn && spotifyExpiresIn > 0
                    ? `Token expires in ${formatExpiresIn(spotifyExpiresIn)}`
                    : "Your Spotify token has expired. Please sign in again."}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not Connected</AlertTitle>
                <AlertDescription>No Spotify access token found. Please sign in with Spotify.</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>

                {result.data && (
                  <div className="mt-2 p-2 bg-muted rounded-md overflow-auto max-h-40">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}

                {result.error && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded-md overflow-auto max-h-40">
                    <pre className="text-xs whitespace-pre-wrap">{result.error}</pre>
                  </div>
                )}
              </Alert>
            )}
          </>
        ) : status === "loading" ? (
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Authenticated</AlertTitle>
            <AlertDescription>You need to sign in to test the Spotify API.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={testSpotifyAPI}
          disabled={isLoading || !session?.spotifyAccessToken || status !== "authenticated"}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Spotify API"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
