"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, MapPin, Mountain, RouteIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"

export default function TestRunsPage() {
  const testRuns = [
    {
      id: "royal-sutton-fun-run",
      name: "Royal Sutton Fun Run",
      distance: "8.5 km",
      location: "Sutton Coldfield, Birmingham",
      elevation: "120m",
      description: "A scenic 8.5km route through Sutton Park and the town center.",
      website: "https://royalsuttonfunrun.org/about-the-run/",
      color: "orange",
    },
    {
      id: "sutton-park-parkrun",
      name: "Sutton Park Parkrun",
      distance: "5 km",
      location: "Sutton Park, Birmingham",
      elevation: "85m",
      description: "A challenging 5km parkrun through the beautiful Sutton Park.",
      website: "https://www.parkrun.org.uk/suttonpark/course/",
      color: "green",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <DemoModeIndicator />

          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold ml-2">Test Runs</h1>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select a Test Run</CardTitle>
                <CardDescription>Choose a run to set your goal time and create a playlist</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testRuns.map((run) => (
                  <Link key={run.id} href={`/test-runs/${run.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-md bg-${run.color}-100 dark:bg-${run.color}-900 flex items-center justify-center`}
                          >
                            <RouteIcon className={`h-8 w-8 text-${run.color}-500`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{run.name}</h3>
                            <div className="flex flex-wrap items-center gap-y-1 text-sm">
                              <MapPin className="mr-1 h-4 w-4" />
                              <span className="mr-3">{run.location}</span>
                              <RouteIcon className="mr-1 h-4 w-4" />
                              <span className="mr-3">{run.distance}</span>
                              <Mountain className="mr-1 h-4 w-4" />
                              <span>{run.elevation}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{run.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
