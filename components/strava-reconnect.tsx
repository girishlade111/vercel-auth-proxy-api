"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function StravaReconnect() {
  const [isLoading, setIsLoading] = useState(false)

  const handleReconnect = async () => {
    setIsLoading(true)
    try {
      // Force a new authentication with Strava
      await signIn("strava", {
        callbackUrl: "/dashboard",
        // Force a new authorization even if already authenticated
        prompt: "consent",
      })

      toast({
        title: "Reconnection initiated",
        description: "You'll be redirected to Strava to reconnect your account.",
      })
    } catch (error) {
      console.error("Error reconnecting to Strava:", error)
      toast({
        title: "Reconnection failed",
        description: "There was an error reconnecting to Strava. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        If you've updated your Strava API credentials or are experiencing authentication issues, you can reconnect your
        Strava account.
      </p>

      <Button onClick={handleReconnect} disabled={isLoading} className="flex items-center gap-2">
        <Route className="h-4 w-4" />
        {isLoading ? "Reconnecting..." : "Reconnect Strava Account"}
      </Button>
    </div>
  )
}
