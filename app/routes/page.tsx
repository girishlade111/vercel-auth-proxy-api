"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { RouteCard } from "@/components/route-card"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/routes")

        if (!response.ok) {
          throw new Error(`Failed to fetch routes: ${response.statusText}`)
        }

        const data = await response.json()
        setRoutes(data.routes || [])
      } catch (err) {
        console.error("Error fetching routes:", err)
        setError("Failed to load routes. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          <DemoModeIndicator />

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Your Routes</h1>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Import Route
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Strava Routes</CardTitle>
              <CardDescription>View your routes and create playlists for them.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-center">
                    <p className="text-muted-foreground">Loading your routes...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-md bg-destructive/10 p-4 text-center">
                  <p className="text-destructive">{error}</p>
                  <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
                    Try Again
                  </Button>
                </div>
              ) : routes.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="mt-4 text-lg font-medium">No routes found</h3>
                  <p className="mt-2 text-muted-foreground">Import routes from Strava to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {routes.map((route) => (
                    <Link key={route.id} href={`/routes/${route.id}`}>
                      <RouteCard
                        title={route.title}
                        distance={route.distance}
                        elevation={route.elevation}
                        date={route.date}
                        location={route.location}
                        targetPace={route.targetPace}
                        hasPlaylist={route.hasPlaylist}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
