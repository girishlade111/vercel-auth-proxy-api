import { Header } from "@/components/header"
import { StravaRoutes } from "@/components/strava-routes"

export const metadata = {
  title: "Strava Routes | Runner's High",
  description: "View your Strava routes",
}

export default function StravaRoutesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold">Strava Routes</h1>
          <StravaRoutes />
        </div>
      </main>
    </div>
  )
}
