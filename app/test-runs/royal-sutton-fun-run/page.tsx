"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin, Mountain, Music, RouteIcon, Save } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Header } from "@/components/header"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"
import { toast } from "@/hooks/use-toast"

// Royal Sutton Fun Run course data
const courseData = {
  name: "Royal Sutton Fun Run",
  distance: "8.5 km",
  distanceValue: 8.5,
  location: "Sutton Coldfield, Birmingham",
  description: "A scenic 8.5km route through Sutton Park and the town center.",
  elevationGain: "120m",
  website: "https://royalsuttonfunrun.org/about-the-run/",
  elevationProfile: [
    { distance: 0, elevation: 120 },
    { distance: 1, elevation: 125 },
    { distance: 2, elevation: 140 },
    { distance: 3, elevation: 160 },
    { distance: 4, elevation: 180 },
    { distance: 5, elevation: 170 },
    { distance: 6, elevation: 150 },
    { distance: 7, elevation: 130 },
    { distance: 8, elevation: 125 },
    { distance: 8.5, elevation: 120 },
  ],
  segments: [
    {
      name: "Start & Town Center",
      startDistance: 0,
      endDistance: 2,
      avgGrade: 1.0,
      startElevation: 120,
      endElevation: 140,
    },
    {
      name: "Park Climb",
      startDistance: 2,
      endDistance: 4,
      avgGrade: 2.0,
      startElevation: 140,
      endElevation: 180,
    },
    {
      name: "Downhill Section",
      startDistance: 4,
      endDistance: 6,
      avgGrade: -1.5,
      startElevation: 180,
      endElevation: 150,
    },
    {
      name: "Final Stretch",
      startDistance: 6,
      endDistance: 8.5,
      avgGrade: -1.2,
      startElevation: 150,
      endElevation: 120,
    },
  ],
}

export default function RoyalSuttonFunRunPage() {
  const { data: session } = useSession()
  const [goalTime, setGoalTime] = useState(50) // Default 50 minutes
  const [targetPace, setTargetPace] = useState(5.9) // Default pace based on goal time
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["electronic", "pop"])
  const [bpmRange, setBpmRange] = useState([140, 160])
  const [isGenerating, setIsGenerating] = useState(false)

  // Calculate pace from goal time
  const calculatePace = (timeMinutes: number) => {
    return timeMinutes / courseData.distanceValue
  }

  // Update pace when goal time changes
  const handleGoalTimeChange = (newTime: number) => {
    setGoalTime(newTime)
    setTargetPace(calculatePace(newTime))
  }

  // Format time display (e.g., 50 -> "50:00")
  const formatTime = (timeMinutes: number) => {
    const minutes = Math.floor(timeMinutes)
    const seconds = Math.round((timeMinutes - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Format pace display (e.g., 5.9 -> "5:54")
  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace)
    const seconds = Math.round((pace - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate BPM for each segment based on pace and grade
  const calculateSegmentBpms = () => {
    // Base cadence for a 5:00 min/km pace
    const baseCadence = 170

    // Adjust base cadence based on target pace (approximately -5 spm per minute slower)
    const paceAdjustment = (5 - targetPace) * 5

    return courseData.segments.map((segment) => {
      // Calculate elevation adjustment based on grade
      const elevationAdjustment = segment.avgGrade > 0 ? segment.avgGrade * 4 : Math.max(segment.avgGrade * 2, -10)

      // Calculate optimal cadence for this segment
      const optimalCadence = Math.round(baseCadence + paceAdjustment + elevationAdjustment)

      // Ensure BPM is within reasonable range (120-200)
      const recommendedBpm = Math.min(Math.max(optimalCadence, 120), 200)

      // Create a BPM range centered around the recommended BPM
      const minBpm = Math.max(recommendedBpm - 5, 120)
      const maxBpm = Math.min(recommendedBpm + 5, 200)

      // Calculate approximate duration based on distance and pace
      const distance = segment.endDistance - segment.startDistance
      const durationMinutes = Math.round(distance * targetPace)

      return {
        ...segment,
        recommendedBpm,
        bpmRange: [minBpm, maxBpm] as [number, number],
        duration: durationMinutes,
      }
    })
  }

  const segmentsWithBpm = calculateSegmentBpms()

  const genres = [
    "electronic",
    "pop",
    "rock",
    "hip-hop",
    "r-n-b",
    "jazz",
    "classical",
    "country",
    "folk",
    "indie",
    "dance",
  ]

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const handleGeneratePlaylist = () => {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Playlist Generated!",
        description: `Your playlist for the Royal Sutton Fun Run with a goal time of ${formatTime(goalTime)} has been created.`,
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <DemoModeIndicator />

          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/test-runs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold ml-2">Royal Sutton Fun Run</h1>
          </div>

          <div className="grid gap-6">
            {/* Course Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
                <CardDescription>Details about the Royal Sutton Fun Run course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <RouteIcon className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{courseData.name}</h3>
                    <div className="flex flex-wrap items-center gap-y-1 text-sm">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span className="mr-3">{courseData.location}</span>
                      <RouteIcon className="mr-1 h-4 w-4" />
                      <span className="mr-3">{courseData.distance}</span>
                      <Mountain className="mr-1 h-4 w-4" />
                      <span>{courseData.elevationGain}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{courseData.description}</p>
                  </div>
                </div>

                {/* Elevation Chart */}
                <div className="mt-4">
                  <Label className="mb-2 block">Elevation Profile</Label>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={courseData.elevationProfile} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        <Tooltip
                          formatter={(value) => [`${value}m`, "Elevation"]}
                          labelFormatter={(value) => `Distance: ${value} km`}
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

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <a href={courseData.website} target="_blank" rel="noopener noreferrer">
                      Visit Official Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Goal Time Setting */}
            <Card>
              <CardHeader>
                <CardTitle>Set Your Goal Time</CardTitle>
                <CardDescription>Define your target time for the Royal Sutton Fun Run</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="goal-time">Goal Time (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGoalTimeChange(Math.max(30, goalTime - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="goal-time"
                      type="number"
                      value={goalTime}
                      onChange={(e) => handleGoalTimeChange(Number(e.target.value))}
                      className="w-16 text-center"
                      min={30}
                      max={120}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleGoalTimeChange(Math.min(120, goalTime + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Slider
                  id="goal-time-slider"
                  min={30}
                  max={120}
                  step={1}
                  value={[goalTime]}
                  onValueChange={(value) => handleGoalTimeChange(value[0])}
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Faster (30 min)</span>
                  <span>Slower (120 min)</span>
                </div>

                <div className="pt-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Target Pace</span>
                      </div>
                      <span className="font-medium">{formatPace(targetPace)} min/km</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Music Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Music Preferences</CardTitle>
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
                      {genres.map((genre) => (
                        <Badge
                          key={genre}
                          variant={selectedGenres.includes(genre) ? "secondary" : "outline"}
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
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
                          Course Sections
                        </TabsTrigger>
                        <TabsTrigger value="songs" className="flex-1">
                          Song Selection
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="sections" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          {segmentsWithBpm.map((segment, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <Music className="h-5 w-5 text-green-500" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{segment.name}</p>
                                  <Badge variant="outline">
                                    {segment.startDistance}-{segment.endDistance} km • {segment.bpmRange[0]}-
                                    {segment.bpmRange[1]} BPM
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {segment.avgGrade > 2 ? (
                                    <span>Uphill section, higher BPM to maintain pace</span>
                                  ) : segment.avgGrade < -2 ? (
                                    <span>Downhill section, moderate BPM to control pace</span>
                                  ) : (
                                    <span>Flat terrain, steady BPM for consistent pace</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="songs" className="pt-4">
                        <div className="text-sm text-muted-foreground mb-4">
                          Based on your preferences and course profile, we'll select songs with appropriate BPM for each
                          section.
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                              <Music className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Start & Town Center (140 BPM)</div>
                              <div className="text-xs text-muted-foreground">Electronic • 3:45</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                              <Music className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Park Climb (155 BPM)</div>
                              <div className="text-xs text-muted-foreground">Hip Hop • 4:12</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                              <Music className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Downhill Section (145 BPM)</div>
                              <div className="text-xs text-muted-foreground">Pop • 3:30</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                              <Music className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Final Stretch (140 BPM)</div>
                              <div className="text-xs text-muted-foreground">Electronic • 3:55</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Playlist Button */}
            <div className="flex justify-end">
              <Button onClick={handleGeneratePlaylist} disabled={isGenerating}>
                <Save className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Playlist"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
