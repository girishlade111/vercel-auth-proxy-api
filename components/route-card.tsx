import Link from "next/link"
import { Calendar, Clock, MapPin, Mountain, Music, Route } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface RouteCardProps {
  title: string
  distance: string
  elevation: string
  date: string
  location: string
  targetPace: string
  hasPlaylist: boolean
}

export function RouteCard({ title, distance, elevation, date, location, targetPace, hasPlaylist }: RouteCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <Route className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{title}</p>
              <Badge variant="outline">{distance}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              <span>{date}</span>
              <Separator orientation="vertical" className="mx-2 h-3" />
              <MapPin className="mr-1 h-3 w-3" />
              <span>{location}</span>
              <Separator orientation="vertical" className="mx-2 h-3" />
              <Mountain className="mr-1 h-3 w-3" />
              <span>{elevation}</span>
              <Separator orientation="vertical" className="mx-2 h-3" />
              <Clock className="mr-1 h-3 w-3" />
              <span>{targetPace}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPlaylist ? (
              <Link href="/playlists">
                <Button variant="outline" size="sm">
                  <Music className="mr-2 h-4 w-4" />
                  View Playlist
                </Button>
              </Link>
            ) : (
              <Link href={`/create-playlist?routeName=${encodeURIComponent(title)}`}>
                <Button size="sm">
                  <Music className="mr-2 h-4 w-4" />
                  Create Playlist
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
