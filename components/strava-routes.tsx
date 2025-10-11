"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { RefreshCw, MapPin, Mountain, Calendar, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StravaRoute {
  id: number
  name: string
  description: string
  distance: number
  elevation_gain: number
  created_at: string
  map: {
    id: string
    summary_polyline: string
  }
}

interface RouteWithMapUrl extends StravaRoute {
  mapUrl?: string | null
}

export function StravaRoutes() {
  const { data: session, status } = useSession()
  const [routes, setRoutes] = useState<RouteWithMapUrl[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoutes = async () => {
    if (!session?.accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/strava/routes")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || response.statusText)
      }

      const data = await response.json()

      // Fetch map URLs for each route
      const routesWithMapUrls = await Promise.all(
        data.routes.map(async (route: StravaRoute) => {
          if (route.map?.summary_polyline) {
            try {
              const mapResponse = await fetch(
                `/api/maps/static?polyline=${encodeURIComponent(route.map.summary_polyline)}`,
              )
              if (mapResponse.ok) {
                const mapData = await mapResponse.json()
                return { ...route, mapUrl: mapData.mapUrl }
              }
            } catch (error) {
              console.error("Error fetching map URL:", error)
            }
          }
          return { ...route, mapUrl: null }
        }),
      )

      setRoutes(routesWithMapUrls)
    } catch (error) {
      console.error("Error fetching Strava routes:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch routes")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchRoutes()
    }
  }, [session])

  // Format distance in kilometers
  const formatDistance = (meters: number) => {
    const km = meters / 1000
    return `${km.toFixed(1)} km`
  }

  // Format elevation gain in meters
  const formatElevation = (meters: number) => {
    return `${Math.round(meters)} m`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strava Routes</CardTitle>
          <CardDescription>Loading session information...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (status === "unauthenticated" || !session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strava Routes</CardTitle>
          <CardDescription>You need to sign in to view your Strava routes.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Strava Routes</h2>
        <Button variant="outline" size="sm" onClick={fetchRoutes} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {routes.length === 0 && !isLoading && !error ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No routes found in your Strava account.</p>
            <p className="mt-2 text-sm text-muted-foreground">Create routes in Strava and they will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <Card key={route.id} className="overflow-hidden">
              {route.map.summary_polyline && (
                <div className="relative h-40 w-full bg-muted">
                  {route.mapUrl ? (
                    <img
                      src={route.mapUrl || "/placeholder.svg"}
                      alt={`Map of ${route.name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{route.name}</CardTitle>
                {route.description && <CardDescription>{route.description}</CardDescription>}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{formatDistance(route.distance)}</span>
                  </div>
                  <div className="flex items-center">
                    <Mountain className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{formatElevation(route.elevation_gain)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(route.created_at)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/routes/${route.id}`}>View Details</Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`https://www.strava.com/routes/${route.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View on Strava</span>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
