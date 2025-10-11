"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: "/" })
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="destructive" onClick={handleSignOut} disabled={isLoading} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  )
}
