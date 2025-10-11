import { Header } from "@/components/header"
import { RouteDetail } from "@/components/route-detail"

interface RoutePageProps {
  params: {
    id: string
  }
}

export default function RoutePage({ params }: RoutePageProps) {
  const routeId = Number.parseInt(params.id, 10)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-4xl">
          <RouteDetail routeId={routeId} />
        </div>
      </main>
    </div>
  )
}
