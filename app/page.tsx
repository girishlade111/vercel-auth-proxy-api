import Link from "next/link"
import { ArrowRight, Music, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
            PaceBeats
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Run to the Perfect Beat
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    PaceBeats analyzes your Strava routes and creates custom Spotify playlists with the perfect BPM to
                    help you hit your target pace, even on hills.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-orange-500 to-green-500 text-white">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/algorithm">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-green-100 dark:from-orange-950 dark:to-green-950">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-white/90 dark:bg-black/90 rounded-lg shadow-lg p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Route className="h-5 w-5 text-orange-500" />
                          <span className="font-medium">Morning Run Route</span>
                        </div>
                        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-md relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-16 px-4">
                              <div className="w-full h-full relative">
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-orange-200 to-orange-300 dark:from-orange-800 dark:to-orange-700 rounded-md">
                                  <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-orange-300 to-orange-400 dark:from-orange-700 dark:to-orange-600 rounded-md"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Pace-Perfect Playlist</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                              <Music className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Uphill Power (160 BPM)</div>
                              <div className="text-xs text-gray-500">For the steep section</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                              <Music className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Steady Flow (145 BPM)</div>
                              <div className="text-xs text-gray-500">For the flat section</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our app combines your Strava route data with music science to create the perfect running soundtrack.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>1. Connect Your Accounts</CardTitle>
                  <CardDescription>Link your Strava and Spotify accounts to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Route className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Music className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2. Select Your Route</CardTitle>
                  <CardDescription>Choose a Strava route and set your target pace.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-md relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-4 bg-orange-200 dark:bg-orange-800 rounded-full">
                        <div className="w-1/2 h-full bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>3. Get Your Playlist</CardTitle>
                  <CardDescription>
                    We'll create a custom playlist with the perfect BPM for each section.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                        <Music className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Downhill Groove (130 BPM)</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                        <Music className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Uphill Power (160 BPM)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 PaceBeats. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
