import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/providers/session-provider"
import { Toaster } from "@/components/toaster"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Runner's High",
  description: "Create Spotify playlists based on your Strava routes",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <GlobalErrorHandler>
            <main className="min-h-screen bg-gray-50">
              {children}
              <DemoModeIndicator />
              <Toaster />
            </main>
          </GlobalErrorHandler>
        </SessionProvider>
      </body>
    </html>
  )
}
