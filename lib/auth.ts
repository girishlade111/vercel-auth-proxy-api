import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export async function getSession() {
  return await getServerSession()
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/signin")
  }
  return session
}
