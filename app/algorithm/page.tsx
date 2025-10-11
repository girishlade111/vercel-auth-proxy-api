import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AlgorithmPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
              PaceBeats
            </span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium" href="/dashboard">
              Dashboard
            </Link>
            <Link className="text-sm font-medium" href="/routes">
              Routes
            </Link>
            <Link className="text-sm font-medium" href="/playlists">
              Playlists
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold ml-2">How Our Algorithm Works</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>The Science Behind PaceBeats</CardTitle>
              <CardDescription>Learn how we match music BPM to your running pace and route elevation</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="elevation">Elevation Analysis</TabsTrigger>
                  <TabsTrigger value="bpm">BPM Calculation</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">The PaceBeats Algorithm</h3>
                    <p>
                      Our algorithm combines exercise science, music theory, and route analysis to create the perfect
                      running soundtrack. Here's how it works:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        <strong>Route Analysis:</strong> We analyze your Strava route data, breaking it down into
                        segments based on elevation changes.
                      </li>
                      <li>
                        <strong>Pace Calculation:</strong> Based on your target pace and the elevation profile, we
                        calculate the optimal cadence (steps per minute) needed to maintain your target pace.
                      </li>
                      <li>
                        <strong>BPM Matching:</strong> We match your optimal cadence to music with the appropriate BPM
                        (beats per minute) to help you naturally maintain the right pace.
                      </li>
                      <li>
                        <strong>Playlist Creation:</strong> We create a seamless playlist that transitions between
                        different BPM ranges as you encounter hills and flat sections on your route.
                      </li>
                    </ol>
                    <p>
                      The result is a personalized soundtrack that helps you maintain your target pace throughout your
                      entire run, even as the terrain changes.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="elevation" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Elevation Analysis</h3>
                    <p>
                      Maintaining a consistent pace on varying terrain requires adjusting your effort level. Here's how
                      we analyze your route's elevation profile:
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Segmentation</h4>
                      <p>We divide your route into segments based on elevation changes, identifying:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Flat sections (less than 1% grade)</li>
                        <li>Uphill sections (categorized by steepness)</li>
                        <li>Downhill sections (categorized by steepness)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Effort Adjustment</h4>
                      <p>
                        Research shows that running uphill requires approximately 4% more effort for each 1% of grade,
                        while running downhill can be up to 2% easier per 1% of grade (up to a certain steepness).
                      </p>
                      <p>
                        We use these principles to calculate the adjusted effort needed for each segment to maintain
                        your target pace.
                      </p>
                    </div>
                    <div className="rounded-md border p-4 bg-muted/50">
                      <h4 className="font-medium mb-2">Example</h4>
                      <p className="text-sm">
                        If your target pace is 5:30 min/km on flat ground, and you encounter a 3% uphill grade, you'll
                        need to increase your effort by approximately 12% to maintain the same pace. Our algorithm will
                        select music with a higher BPM to help you naturally increase your cadence and maintain your
                        pace.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bpm" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">BPM Calculation</h3>
                    <p>
                      The relationship between running cadence and music BPM is key to our algorithm. Here's how we
                      calculate the optimal BPM for each section of your route:
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Cadence to BPM Conversion</h4>
                      <p>
                        Most runners have a cadence between 150-180 steps per minute (spm). Research shows that runners
                        naturally synchronize their steps to music when the BPM is within 5-10% of their natural
                        cadence.
                      </p>
                      <p>We use the following formula to calculate the optimal BPM range for each segment:</p>
                      <div className="rounded-md border p-4 bg-muted/50 my-2">
                        <p className="text-sm font-mono">Base Cadence = 170 spm (average for recreational runners)</p>
                        <p className="text-sm font-mono">Pace Adjustment = (Target Pace - 5:00) × -5 spm</p>
                        <p className="text-sm font-mono">Elevation Adjustment = Grade × 4 spm</p>
                        <p className="text-sm font-mono">
                          Optimal Cadence = Base Cadence + Pace Adjustment + Elevation Adjustment
                        </p>
                        <p className="text-sm font-mono">Optimal BPM = Optimal Cadence</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Music Selection</h4>
                      <p>
                        Once we calculate the optimal BPM for each segment, we select songs from your preferred genres
                        that match these BPM ranges. We also ensure smooth transitions between segments by selecting
                        songs with compatible BPM changes.
                      </p>
                    </div>
                    <div className="rounded-md border p-4 bg-muted/50">
                      <h4 className="font-medium mb-2">Example BPM Ranges</h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          <strong>Flat terrain, 5:30 pace:</strong> 140-145 BPM
                        </li>
                        <li>
                          <strong>3% uphill, 5:30 pace:</strong> 155-160 BPM
                        </li>
                        <li>
                          <strong>3% downhill, 5:30 pace:</strong> 130-135 BPM
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
