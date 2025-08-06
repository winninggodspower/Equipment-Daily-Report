"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import FormInput from "@/components/form-input"
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      redirect: false, // Prevent NextAuth.js from redirecting automatically
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
    } else {
      toast.success("Login successful!")
      router.push("/admin") 
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6 text-center">
          <h1 className="text-3xl font-semibold text-white mb-2">Admin Login</h1>
          <p className="text-emerald-100 text-sm">Access your equipment report dashboard</p>
        </div>

        <div className="p-8">
          {/* General Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-3 text-red-400" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />}
              inputClassName="pl-10" // Add padding for icon
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="adminpassword"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />}
              inputClassName="pl-10" // Add padding for icon
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-400 disabled:to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform hover:scale-[1.01] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
