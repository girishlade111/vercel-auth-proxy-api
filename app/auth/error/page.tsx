"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>There was a problem authenticating your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
            <p className="font-medium">Error details:</p>
            <p className="text-sm mt-1">{error || "Unknown authentication error"}</p>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>This could be due to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Incorrect OAuth configuration</li>
              <li>Missing environment variables</li>
              <li>Expired or invalid tokens</li>
              <li>Server-side authentication issues</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
