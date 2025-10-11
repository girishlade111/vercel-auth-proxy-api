"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowRight, Clock, Music, RouteIcon, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { RouteCard } from "@/components/route-card"
import { ConnectAccounts } from "@/components/connect-accounts"
import { SpotifyPlaylists } from "@/components/spotify-playlists"
import { mockRoutes } from "@/lib/mock-data"

export function DashboardClient() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Simplified authentication check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (useEffect will redirect)
  if (status === "unauthenticated") {
    return null
  }

  // Check if connected based on session
  const isConnected = {
    strava: !!session?.accessToken,
    spotify: !!session?.spotifyAccessToken,
  }

  // Check for authentication errors
  if (session?.error) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-destructive">Authentication Error</CardTitle>
          <CardDescription>There was a problem with your authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Error details: {session.error}</p>
          <p className="mt-2">Please try reconnecting your accounts.</p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={() => router.push("/auth/signin")}>
            Reconnect Accounts
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Get the first 3 routes for the dashboard
  const recentRoutes = mockRoutes.slice(0, 3)

  return (
    <>
      {!isConnected.strava || !isConnected.spotify ? (
        <ConnectAccounts isConnected={isConnected} />
      ) : (
        <Tabs defaultValue="overview">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/routes">
                  <RouteIcon className="mr-2 h-4 w-4" />
                  View Routes
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/test-runs">
                  <RouteIcon className="mr-2 h-4 w-4" />
                  Test Runs
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/create-playlist">
                  <Music className="mr-2 h-4 w-4" />
                  Create Playlist
                </Link>
              </Button>
            </div>
          </div>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                  <RouteIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockRoutes.length}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Playlists</CardTitle>
                  <Music className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+3 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Pace Improvement</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+8%</div>
                  <p className="text-xs text-muted-foreground">+2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Goal Completion</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <Progress value={78} className="mt-2" />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRoutes.map((route) => (
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
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/routes" className="flex items-center justify-center w-full">
                      View All Routes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Playlists</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpotifyPlaylists />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/playlists" className="flex items-center justify-center w-full">
                      View All Playlists
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="routes" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Routes</CardTitle>
                <CardDescription>Manage your Strava routes and create playlists for them.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRoutes.map((route) => (
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="playlists" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Playlists</CardTitle>
                <CardDescription>Manage your pace-optimized Spotify playlists.</CardDescription>
              </CardHeader>
              <CardContent>
                <SpotifyPlaylists />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}
