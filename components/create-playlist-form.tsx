"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Music } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"

interface RouteSegment {
  name: string
  distanceRange: [number, number]
  bpmRange: [number, number]
  duration: number
  grade?: number
}

interface CreatePlaylistFormProps {
  routeName: string
  routeSegments: RouteSegment[]
}

export function CreatePlaylistForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeIdParam = searchParams.get("routeId")

  const [routeId, setRouteId] = useState<string>(routeIdParam || "")
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [playlistName, setPlaylistName] = useState(routeIdParam ? "" : `PaceBeats: ${"routeName"}`)
  const [playlistDescription, setPlaylistDescription] = useState(
    routeIdParam ? "" : `Custom playlist for ${"routeName"} with pace-optimized BPM for each segment.`,
  )
  const [isPublic, setIsPublic] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["electronic", "pop"])
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
    genres: ["electronic", "pop"],
  })

  // Check if we're in demo mode
  const isDemoMode = session?.accessToken === "demo-strava-token"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Not signed in",
        description: "Please sign in to create a playlist.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In demo mode, just simulate API call
      if (isDemoMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: "Demo: Playlist created!",
          description: `Your playlist "${playlistName}" has been created successfully in demo mode.`,
        })

        router.push("/playlists")
        return
      }

      // Real API call for non-demo mode
      const response = await fetch("/api/spotify/generate-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routeName: playlistName,
          routeSegments,
          genres: selectedGenres,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create playlist")
      }

      const data = await response.json()

      toast({
        title: "Playlist created!",
        description: `Your playlist "${playlistName}" has been created successfully.`,
      })

      router.push("/playlists")
    } catch (error) {
      console.error("Error creating playlist:", error)
      toast({
        title: "Error creating playlist",
        description: "There was an error creating your playlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add effect to fetch route details if routeId is provided
  useEffect(() => {
    if (routeIdParam) {
      // Fetch route details and pre-fill form
      const fetchRouteDetails = async () => {
        try {
          const response = await fetch(`/api/strava/routes/${routeIdParam}`)
          if (response.ok) {
            const data = await response.json()
            // Pre-fill form with route data
            setFormData((prev) => ({
              ...prev,
              name: `Playlist for ${data.route.name}`,
              description: `Generated playlist for the route: ${data.route.name}`,
              // Set other relevant fields based on the route
            }))
            setPlaylistName(`Playlist for ${data.route.name}`)
            setPlaylistDescription(`Generated playlist for the route: ${data.route.name}`)
            setRouteSegments(data.route.segments)
          }
        } catch (error) {
          console.error("Error fetching route details:", error)
        }
      }

      fetchRouteDetails()
    }
  }, [routeIdParam])

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Spotify</CardTitle>
          <CardDescription>You need to connect your Spotify account to create playlists.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Music className="h-16 w-16 text-muted-foreground opacity-50" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Playlist for {playlistName}</CardTitle>
        <CardDescription>
          Create a Spotify playlist with songs matching the BPM requirements for each segment.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-name">Playlist Name</Label>
            <Input id="playlist-name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playlist-description">Description</Label>
            <Textarea
              id="playlist-description"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is-public" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked === true)} />
            <Label htmlFor="is-public">Make playlist public</Label>
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label>Route Segments</Label>
            <div className="space-y-2">
              {routeSegments.map((segment, index) => (
                <div key={index} className="rounded-md border p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{segment.name}</span>
                    <Badge variant="outline">
                      {segment.bpmRange[0]}-{segment.bpmRange[1]} BPM
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {segment.distanceRange[0]}-{segment.distanceRange[1]} km • ~{segment.duration} min
                    {segment.grade !== undefined && (
                      <span className="ml-2">
                        • Grade: {segment.grade > 0 ? "+" : ""}
                        {segment.grade.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Playlist..." : isDemoMode ? "Create Demo Playlist" : "Create Playlist"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
