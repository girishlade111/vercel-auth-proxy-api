"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, Music, AlertCircle, CheckCircle } from "lucide-react"
import { checkProxyHealth, getSpotifyProfileViaProxy, checkSpotifyStatusViaProxy } from "@/lib/spotify-proxy"

export function SpotifyProxyTest() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [proxyStatus, setProxyStatus] = useState<boolean | null>(null)
  const [proxyStatusLoading, setProxyStatusLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: any
    error?: string
  } | null>(null)

  const checkProxy = async () => {
    setProxyStatusLoading(true)
    try {
      const isHealthy = await checkProxyHealth()
      setProxyStatus(isHealthy)
    } catch (error) {
      console.error("Error checking proxy health:", error)
      setProxyStatus(false)
    } finally {
      setProxyStatusLoading(false)
    }
  }

  const testSpotifyProxy = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // First check if the proxy is available
      const isHealthy = await checkProxyHealth()

      if (!isHealthy) {
        setResult({
          success: false,
          message: "Spotify Auth Proxy is not available",
          error: "The proxy server is not responding. Please check if it's running.",
        })
        return
      }

      // Then check Spotify status
      const statusData = await checkSpotifyStatusViaProxy(session)

      // Finally get the profile
      const profileData = await getSpotifyProfileViaProxy(session)

      setResult({
        success: true,
        message: "Successfully connected to Spotify API via proxy",
        data: {
          status: statusData,
          profile: profileData,
        },
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to connect to Spotify API via proxy",
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Spotify Auth Proxy Test
        </CardTitle>
        <CardDescription>Test your Spotify API connection via the auth proxy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">Proxy Status</h3>
            <p className="text-sm text-muted-foreground">Check if the Spotify Auth Proxy is available</p>
          </div>
          <Button variant="outline" size="sm" onClick={checkProxy} disabled={proxyStatusLoading}>
            {proxyStatusLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Proxy"
            )}
          </Button>
        </div>

        {proxyStatus !== null && (
          <Alert variant={proxyStatus ? "default" : "destructive"}>
            {proxyStatus ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{proxyStatus ? "Proxy Available" : "Proxy Unavailable"}</AlertTitle>
            <AlertDescription>
              {proxyStatus
                ? "The Spotify Auth Proxy is up and running."
                : "The Spotify Auth Proxy is not responding. Please check if it's running."}
            </AlertDescription>
          </Alert>
        )}

        {status === "authenticated" ? (
          <>
            {session?.spotifyAccessToken ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Spotify Token Available</AlertTitle>
                <AlertDescription>You have a Spotify access token that can be used with the proxy.</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Spotify Token</AlertTitle>
                <AlertDescription>No Spotify access token found. Please sign in with Spotify.</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
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
          onClick={testSpotifyProxy}
          disabled={isLoading || !session?.spotifyAccessToken || status !== "authenticated" || proxyStatus === false}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Spotify API via Proxy"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
