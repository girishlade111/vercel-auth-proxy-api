"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function AuthStatus() {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="hidden">
      {/* This component doesn't render anything visible, just checks auth status */}
      {status === "authenticated" && <span data-authenticated="true" />}
      {status === "unauthenticated" && <span data-authenticated="false" />}
      {status === "loading" && <span data-authenticated="loading" />}
    </div>
  )
}
