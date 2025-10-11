"use client"

import { useEffect, useState } from "react"
import { Calendar, Music, Play } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SpotifyPlaylist } from "@/lib/spotify"

export function SpotifyPlaylists() {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchPlaylists()
    }
  }, [session])

  const fetchPlaylists = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/spotify/playlists")

      if (!response.ok) {
        throw new Error(`Failed to fetch playlists: ${response.statusText}`)
      }

      const data = await response.json()
      setPlaylists(data.playlists?.items || [])
    } catch (err) {
      console.error("Error fetching playlists:", err)
      setError("Failed to load playlists. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading your playlists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-center">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={fetchPlaylists} className="mt-2">
          Try Again
        </Button>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <Music className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">Sign in to view playlists</h3>
        <p className="mt-2 text-muted-foreground">Sign in to see your playlists.</p>
      </div>
    )
  }

  if (playlists.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <Music className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No playlists found</h3>
        <p className="mt-2 text-muted-foreground">Create playlists for your routes to see them here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {playlists.map((playlist) => (
        <Card key={playlist.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-green-100 dark:bg-green-900 overflow-hidden">
                {playlist.images && playlist.images.length > 0 ? (
                  <img
                    src={playlist.images[0].url || "/placeholder.svg"}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="h-8 w-8 m-4 text-green-500" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium">{playlist.name}</p>
                  <Badge variant="outline">{playlist.tracks.total} tracks</Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Created by {playlist.owner.display_name}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://open.spotify.com/playlist/${playlist.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="mr-2 h-3 w-3" />
                      Open in Spotify
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
