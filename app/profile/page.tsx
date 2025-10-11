"use client"

import { useSession } from "next-auth/react"
import { Music, Route } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  const isConnected = {
    strava: !!session?.accessToken,
    spotify: !!session?.spotifyAccessToken,
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-6">
          <div className="container max-w-4xl">
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-6">
          <div className="container max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Sign In Required</CardTitle>
                <CardDescription>Please sign in to view your profile.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button asChild>
                  <a href="/api/auth/signin">Sign In</a>
                </Button>
              </CardContent>
            </Card>
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
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold">Your Profile</h1>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback className="text-2xl">{session.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Manage your connected service accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Route className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Strava</p>
                      <p className="text-xs text-muted-foreground">
                        {isConnected.strava ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button variant={isConnected.strava ? "outline" : "default"}>
                    {isConnected.strava ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Music className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Spotify</p>
                      <p className="text-xs text-muted-foreground">
                        {isConnected.spotify ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button variant={isConnected.spotify ? "outline" : "default"}>
                    {isConnected.spotify ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Settings</CardTitle>
                <CardDescription>Customize your app experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates about your playlists and routes</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Privacy Settings</p>
                    <p className="text-xs text-muted-foreground">Control how your data is used and shared</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
