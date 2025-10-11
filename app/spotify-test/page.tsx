import { Header } from "@/components/header"
import { SpotifyTest } from "@/components/spotify-test"

export default function SpotifyTestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Spotify API Test</h1>
          <p className="text-muted-foreground mb-6">
            This page allows you to test your Spotify API connection. Sign in with Spotify and click the test button to
            verify your connection.
          </p>
          <SpotifyTest />
        </div>
      </main>
    </div>
  )
}
