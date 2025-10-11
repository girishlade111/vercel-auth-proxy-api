"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bug } from "lucide-react"

export function AuthDebugLink() {
  return (
    <Link href="/admin/auth-debug">
      <Button variant="outline" size="sm" className="gap-2">
        <Bug className="h-4 w-4" />
        Auth Debug
      </Button>
    </Link>
  )
}
