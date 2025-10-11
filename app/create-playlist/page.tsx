"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Clock, MapPin, Mountain, Music, Route } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Header } from "@/components/header"
import { ConnectAccounts } from "@/components/connect-accounts"
import { CreatePlaylistForm } from "@/components/create-playlist-form"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"

// Mock route segments for demo purposes
const mockRouteSegments = [
  { name: "Warm-up", distanceRange: [0, 1], bpmRange: [120, 130], grade: 0 },
  { name: "Flat Section", distanceRange: [1, 3], bpmRange: [130, 140], grade: 0 },
  { name: "Uphill Climb", distanceRange: [3, 4], bpmRange: [140, 150], grade: 5 },
  { name: "Downhill Descent", distanceRange: [4, 5], bpmRange: [135, 145], grade: -5 },
  { name: "Final Sprint", distanceRange: [5, 5.2], bpmRange: [150, 160], grade: 0 },
]

export default function CreatePlaylist() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const routeId = searchParams.get("routeId")
  const routeName = searchParams.get("routeName") || "Morning Run"

  const [route, setRoute] = useState<any>(null)
  const [playlistStructure, setPlaylistStructure] = useState<any[]>([])
  const [targetPace, setTargetPace] = useState(5.5) // minutes per km
  const [bpmRange, setBpmRange] = useState([140, 160])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch route details if routeId is provided
  useEffect(() => {
    if (routeId) {
      const fetchRouteDetails = async () => {
        setIsLoading(true)
        setError(null)

        try {
          const response = await fetch(`/api/routes/${routeId}?targetPace=${targetPace}`)

          if (!response.ok) {
            throw new Error(`Failed to fetch route details: ${response.statusText}`)
          }

          const data = await response.json()
          setRoute(data.route)
          setPlaylistStructure(data.playlistStructure)

          // Set BPM range based on the min and max BPM from segments
          if (data.playlistStructure && data.playlistStructure.length > 0) {
            const minBpm = Math.min(...data.playlistStructure.map((s: any) => s.bpmRange[0]))
            const maxBpm = Math.max(...data.playlistStructure.map((s: any) => s.bpmRange[1]))
            setBpmRange([minBpm, maxBpm])
          }
        } catch (err) {
          console.error("Error fetching route details:", err)
          setError("Failed to load route details. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }

      fetchRouteDetails()
    }
  }, [routeId, targetPace])

  // Format pace display (e.g., 5.5 -> "5:30")
  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace)
    const seconds = Math.round((pace - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const isConnected = {
    strava: !!session?.accessToken,
    spotify: !!session?.spotifyAccessToken,
  }

  // Check if we're in demo mode
  const isDemoMode = session?.accessToken === "demo-strava-token"

  // If we have a routeId but no route data yet, show loading
  if (routeId && isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-6">
          <div className="container max-w-4xl">
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Loading route data...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <DemoModeIndicator />

          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href={routeId ? `/routes/${routeId}` : "/dashboard"}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold ml-2">Create Pace-Optimized Playlist</h1>
          </div>

          {!isConnected.strava || !isConnected.spotify ? (
            <ConnectAccounts isConnected={isConnected} />
          ) : (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Route Information</CardTitle>
                  <CardDescription>
                    {routeId ? "Using selected route" : "Choose a Strava route to create a playlist for"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!routeId ? (
                    <Select defaultValue="morning-run">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning-run">Morning Run (5.2 km)</SelectItem>
                        <SelectItem value="hill-training">Hill Training (8.7 km)</SelectItem>
                        <SelectItem value="recovery-jog">Recovery Jog (3.1 km)</SelectItem>
                        <SelectItem value="long-run">Long Run (15.3 km)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : route ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                          <Route className="h-6 w-6 text-orange-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{route.title}</p>
                          <div className="flex flex-wrap items-center gap-y-1 text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{route.location}</span>
                            <Separator orientation="vertical" className="mx-2 h-3" />
                            <Mountain className="mr-1 h-3 w-3" />
                            <span>{route.elevation}</span>
                            <Separator orientation="vertical" className="mx-2 h-3" />
                            <Route className="mr-1 h-3 w-3" />
                            <span>{route.distance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={route.elevationProfile} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                              dataKey="distance"
                              tickFormatter={(value) => `${value} km`}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              dataKey="elevation"
                              tickFormatter={(value) => `${value}m`}
                              axisLine={false}
                              tickLine={false}
                              orientation="right"
                            />
                            <Area
                              type="monotone"
                              dataKey="elevation"
                              stroke="#f97316"
                              fill="url(#colorElevation)"
                              strokeWidth={2}
                            />
                            <defs>
                              <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Route not found. Please select another route.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Set Target Pace</CardTitle>
                  <CardDescription>Define your target pace for this route</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="target-pace">Target Pace (min/km)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setTargetPace(Math.max(3, targetPace - 0.1))}
                      >
                        -
                      </Button>
                      <span className="w-16 text-center font-medium">{formatPace(targetPace)}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setTargetPace(Math.min(10, targetPace + 0.1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Slider
                    id="target-pace"
                    min={3}
                    max={10}
                    step={0.1}
                    value={[targetPace]}
                    onValueChange={(value) => setTargetPace(value[0])}
                  />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Faster (3:00)</span>
                    <span>Slower (10:00)</span>
                  </div>

                  {route && (
                    <div className="pt-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Estimated Completion Time</span>
                          </div>
                          <span className="font-medium">
                            {Math.floor((route.distanceValue * targetPace) / 60)}h{" "}
                            {Math.round((route.distanceValue * targetPace) % 60)}m
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Music Preferences</CardTitle>
                  <CardDescription>Customize your playlist settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bpm-range">BPM Range</Label>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">{bpmRange[0]} BPM</span>
                        <span className="text-sm">{bpmRange[1]} BPM</span>
                      </div>
                      <Slider
                        id="bpm-range"
                        min={100}
                        max={200}
                        step={5}
                        value={bpmRange}
                        onValueChange={setBpmRange}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Slower cadence</span>
                        <span>Faster cadence</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Label>Genre Preferences</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                          Pop
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                          Rock
                        </Badge>
                        <Badge variant="secondary" className="cursor-pointer">
                          Electronic
                        </Badge>
                        <Badge variant="secondary" className="cursor-pointer">
                          Hip Hop
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                          R&B
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                          Jazz
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                          Classical
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                          Country
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Playlist Preview</Label>
                    <div className="mt-2">
                      <Tabs defaultValue="sections">
                        <TabsList className="w-full">
                          <TabsTrigger value="sections" className="flex-1">
                            Route Sections
                          </TabsTrigger>
                          <TabsTrigger value="songs" className="flex-1">
                            Song Selection
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="sections" className="space-y-4 pt-4">
                          <div className="space-y-4">
                            {playlistStructure.length > 0 ? (
                              playlistStructure.map((segment, index) => (
                                <div key={index} className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                    <Music className="h-5 w-5 text-green-500" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium">{segment.name}</p>
                                      <Badge variant="outline">
                                        {segment.distanceRange[0]}-{segment.distanceRange[1]} km • {segment.bpmRange[0]}
                                        -{segment.bpmRange[1]} BPM
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {segment.grade > 2 ? (
                                        <span>Uphill section, higher BPM to maintain pace</span>
                                      ) : segment.grade < -2 ? (
                                        <span>Downhill section, moderate BPM to control pace</span>
                                      ) : (
                                        <span>Flat terrain, steady BPM for consistent pace</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-muted-foreground">
                                  {routeId ? "Loading route segments..." : "Select a route to see segments"}
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        <TabsContent value="songs" className="pt-4">
                          <div className="text-sm text-muted-foreground mb-4">
                            Based on your preferences and route profile, we'll select songs with appropriate BPM for
                            each section.
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                                <Music className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Warm-up Song (140 BPM)</div>
                                <div className="text-xs text-muted-foreground">Electronic • 3:45</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                                <Music className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Hill Climb Song 1 (155 BPM)</div>
                                <div className="text-xs text-muted-foreground">Hip Hop • 4:12</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                                <Music className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Hill Climb Song 2 (160 BPM)</div>
                                <div className="text-xs text-muted-foreground">Electronic • 3:30</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                                <Music className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Downhill Song 1 (150 BPM)</div>
                                <div className="text-xs text-muted-foreground">Hip Hop • 3:55</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                                <Music className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Downhill Song 2 (145 BPM)</div>
                                <div className="text-xs text-muted-foreground">Electronic • 4:05</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                                <Music className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Final Push Song (140 BPM)</div>
                                <div className="text-xs text-muted-foreground">Electronic • 3:25</div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <CreatePlaylistForm
                routeName={routeName || "Custom Route"}
                routeSegments={playlistStructure.length > 0 ? playlistStructure : mockRouteSegments}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
