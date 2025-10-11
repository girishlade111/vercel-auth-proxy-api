"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { checkProxyHealth } from "@/lib/auth-proxy"

export function ProxyStatus() {
  const [isProxyAvailable, setIsProxyAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const checkProxy = async () => {
      setIsChecking(true)
      try {
        const available = await checkProxyHealth()
        setIsProxyAvailable(available)
      } catch (error) {
        console.error("Error checking proxy status:", error)
        setIsProxyAvailable(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkProxy()
  }, [])

  if (isChecking || isProxyAvailable === null) {
    return (
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checking Auth Proxy</AlertTitle>
        <AlertDescription>Verifying connection to authentication proxy...</AlertDescription>
      </Alert>
    )
  }

  if (!isProxyAvailable) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Auth Proxy Unavailable</AlertTitle>
        <AlertDescription>
          The authentication proxy is currently unavailable. Spotify authentication may not work properly.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert
      variant="default"
      className="mb-4 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200 border-green-200 dark:border-green-800"
    >
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle>Auth Proxy Connected</AlertTitle>
      <AlertDescription>Successfully connected to the authentication proxy at auth.runnershigh.uk</AlertDescription>
    </Alert>
  )
}
