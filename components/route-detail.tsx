"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Mountain, Calendar, Clock, ArrowLeft, Music, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface RouteDetailProps {
  routeId: number
}

export function RouteDetail({ routeId }: RouteDetailProps) {
  const router = useRouter()
  const [route, setRoute] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRouteDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/strava/routes/${routeId}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || response.statusText)
        }

        const data = await response.json()
        setRoute(data)
      } catch (error) {
        console.error("Error fetching route details:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch route details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRouteDetails()
  }, [routeId])

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

  // Format route type
  const getRouteType = (type: number) => {
    // 1 = ride, 2 = run
    return type === 1 ? "Ride" : type === 2 ? "Run" : "Other"
  }

  // Format estimated time
  const formatEstimatedTime = (distance: number, type: number) => {
    // Very rough estimation:
    // For running: ~5:30 min/km pace
    // For cycling: ~20 km/h
    const distanceKm = distance / 1000

    if (type === 2) {
      // Run
      const minutes = Math.round(distanceKm * 5.5)
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60

      if (hours > 0) {
        return `~${hours}h ${remainingMinutes}m`
      }
      return `~${minutes}m`
    } else {
      // Ride or other
      const hours = distanceKm / 20
      const hoursRounded = Math.floor(hours)
      const minutesRounded = Math.round((hours - hoursRounded) * 60)

      if (hoursRounded > 0) {
        return `~${hoursRounded}h ${minutesRounded}m`
      }
      return `~${Math.round(hours * 60)}m`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <Skeleton className="h-64 w-full" />

        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>

        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  if (!route || !route.route) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>

        <Alert>
          <AlertTitle>Route Not Found</AlertTitle>
          <AlertDescription>The requested route could not be found.</AlertDescription>
        </Alert>

        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const { route: routeData, mapUrl } = route

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">{routeData.name}</h1>
      </div>

      {/* Map */}
      {mapUrl && (
        <div className="overflow-hidden rounded-lg border">
          <img
            src={mapUrl || "/placeholder.svg"}
            alt={`Map of ${routeData.name}`}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Route description */}
      {routeData.description && (
        <Card>
          <CardContent className="pt-6">
            <p>{routeData.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Route stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{formatDistance(routeData.distance)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Elevation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{formatElevation(routeData.elevation_gain)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{getRouteType(routeData.type)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{formatEstimatedTime(routeData.distance, routeData.type)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button className="flex-1" asChild>
          <a href={`/create-playlist?routeId=${routeId}`}>
            <Music className="mr-2 h-4 w-4" />
            Create Playlist for this Route
          </a>
        </Button>

        <Button variant="outline" asChild>
          <a href={`https://www.strava.com/routes/${routeId}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Strava
          </a>
        </Button>
      </div>
    </div>
  )
}
