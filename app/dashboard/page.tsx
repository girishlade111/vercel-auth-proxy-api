import { Header } from "@/components/header"
import { DashboardClient } from "@/components/dashboard-client"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"
import { AuthDebugPanel } from "@/components/auth-debug-panel"
import { AuthDebugLink } from "@/components/auth-debug-link"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          <AuthDebugPanel />
          <DemoModeIndicator />
          <AuthDebugLink />
          <DashboardClient />
        </div>
      </main>
    </div>
  )
}
