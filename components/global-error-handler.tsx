"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export function GlobalErrorHandler() {
  const router = useRouter()
  const { data: session, status, update } = useSession()

  useEffect(() => {
    // Check for token expiration headers
    const checkTokenExpiration = () => {
      const tokenExpired = document.querySelector('meta[name="x-auth-token-expired"]')?.getAttribute("content")

      if (tokenExpired === "spotify") {
        toast({
          title: "Spotify Session Expired",
          description: "Your Spotify session has expired. Refreshing...",
          variant: "default",
        })

        // Try to refresh the session
        update().catch(() => {
          toast({
            title: "Authentication Error",
            description: "Failed to refresh your Spotify session. Please sign in again.",
            variant: "destructive",
          })
          router.push("/auth/signin")
        })
      }

      if (tokenExpired === "strava") {
        toast({
          title: "Strava Session Expired",
          description: "Your Strava session has expired. Refreshing...",
          variant: "default",
        })

        // Try to refresh the session
        update().catch(() => {
          toast({
            title: "Authentication Error",
            description: "Failed to refresh your Strava session. Please sign in again.",
            variant: "destructive",
          })
          router.push("/auth/signin")
        })
      }
    }

    // Check for session errors
    const checkSessionErrors = () => {
      if (session?.error) {
        toast({
          title: "Authentication Error",
          description: session.error,
          variant: "destructive",
        })
      }
    }

    checkTokenExpiration()
    checkSessionErrors()
  }, [router, session, update])

  return null
}
