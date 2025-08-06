

import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/api/auth/[...nextauth]/route"
import AdminDashboard from "./admin-dasboard"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <AdminDashboard />
}