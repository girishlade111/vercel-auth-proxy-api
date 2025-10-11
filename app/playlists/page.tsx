"use client"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotifyPlaylists } from "@/components/spotify-playlists"
import { ConnectAccounts } from "@/components/connect-accounts"
import { Header } from "@/components/header"
import { Music } from "lucide-react"

export default function PlaylistsPage() {
  const { data: session, status } = useSession()

  const isConnected = {
    strava: !!session?.accessToken,
    spotify: !!session?.spotifyAccessToken,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          {!isConnected.spotify ? (
            <ConnectAccounts isConnected={isConnected} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Your Playlists</h1>
                <div className="flex items-center gap-2">
                  <Button size="sm">
                    <Music className="mr-2 h-4 w-4" />
                    Create Playlist
                  </Button>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Spotify Playlists</CardTitle>
                  <CardDescription>View and manage your Spotify playlists.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SpotifyPlaylists />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
