import { Header } from "@/components/header"
import { StravaTest } from "@/components/strava-test"

export const metadata = {
  title: "Strava API Test | Runner's High",
  description: "Test your Strava API connection",
}

export default function StravaTestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-md">
          <h1 className="mb-6 text-2xl font-bold">Strava API Test</h1>
          <StravaTest />
        </div>
      </main>
    </div>
  )
}
