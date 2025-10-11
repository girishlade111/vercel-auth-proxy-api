import { Header } from "@/components/header"
import { SpotifyProxyTest } from "@/components/spotify-proxy-test"

export default function SpotifyProxyTestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Spotify Auth Proxy Test</h1>
          <p className="text-muted-foreground mb-6">
            This page allows you to test your Spotify API connection through the auth proxy at www.runnershigh.uk. Sign
            in with Spotify and click the test button to verify your connection.
          </p>
          <SpotifyProxyTest />
        </div>
      </main>
    </div>
  )
}
