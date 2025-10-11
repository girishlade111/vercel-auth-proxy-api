"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Music, Route, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const error = searchParams.get("error")
  const [isLoading, setIsLoading] = useState({
    demo: false,
    strava: false,
    spotify: false,
  })

  const handleDemoSignIn = async () => {
    setIsLoading({ ...isLoading, demo: true })
    try {
      await signIn("credentials", { callbackUrl, username: "demo" })
    } catch (error) {
      console.error("Error signing in with demo mode:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with demo mode. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading({ ...isLoading, demo: false })
    }
  }

  const handleStravaSignIn = async () => {
    setIsLoading({ ...isLoading, strava: true })
    try {
      await signIn("strava", { callbackUrl })
    } catch (error) {
      console.error("Error signing in with Strava:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Strava. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading({ ...isLoading, strava: false })
    }
  }

  const handleSpotifySignIn = async () => {
    setIsLoading({ ...isLoading, spotify: true })
    try {
      await signIn("spotify", { callbackUrl })
    } catch (error) {
      console.error("Error signing in with Spotify:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Spotify. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading({ ...isLoading, spotify: false })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In to PaceBeats</CardTitle>
          <CardDescription>
            Connect with your Strava or Spotify account to create pace-optimized playlists.
          </CardDescription>
          {error && (
            <div className="mt-4 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
              {error === "OAuthAccountNotLinked"
                ? "This account is already linked to another user. Please sign in with the original account."
                : "Authentication error. Please try again."}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12"
            onClick={handleDemoSignIn}
            disabled={isLoading.demo}
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-3 w-3 text-blue-500" />
            </div>
            {isLoading.demo ? "Signing in with Demo Mode..." : "Sign in with Demo Mode"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or with API connections</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12"
            onClick={handleStravaSignIn}
            disabled={isLoading.strava}
          >
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <Route className="h-3 w-3 text-orange-500" />
            </div>
            {isLoading.strava ? "Signing in with Strava..." : "Sign in with Strava"}
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12"
            onClick={handleSpotifySignIn}
            disabled={isLoading.spotify}
          >
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <Music className="h-3 w-3 text-green-500" />
            </div>
            {isLoading.spotify ? "Signing in with Spotify..." : "Sign in with Spotify"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
