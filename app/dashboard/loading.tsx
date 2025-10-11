import { Header } from "@/components/header"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
