'use client'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()

  // Credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setError('')
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    
    // Force a session refresh
    await supabase.auth.getSession()
    
    router.push('/dashboard')
    router.refresh() // Important to refresh the server-side state
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed')
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-background border border-foreground/10 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={() => {/* Forgot password logic */}}
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login
          </button>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-foreground/70 hover:underline hover:text-foreground"
              onClick={() => router.push('signup')}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
