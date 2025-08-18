'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

// Password requirements
const passwordRequirements = [
  { re: /.{8,}/, label: 'At least 8 characters' },
  { re: /[A-Z]/, label: 'At least one uppercase letter' },
  { re: /[a-z]/, label: 'At least one lowercase letter' },
  { re: /[0-9]/, label: 'At least one number' },
  { re: /[^A-Za-z0-9]/, label: 'At least one special character' }
]

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [passwordError, setPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [requirements, setRequirements] = useState(
    passwordRequirements.map(req => ({ ...req, valid: false }))
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = re.test(email)
    setEmailError(isValid ? '' : 'Please enter a valid email address')
    return isValid
  }

  // Password validation
  const validatePassword = (password: string) => {
    const newRequirements = passwordRequirements.map(req => ({
      ...req,
      valid: req.re.test(password)
    }))
    setRequirements(newRequirements)
    return newRequirements.every(req => req.valid)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'password') {
      validatePassword(value)
    }
    if (name === 'email') {
      validateEmail(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setPasswordError('')
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!validateEmail(formData.email)) {
        throw new Error('Invalid email format')
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match")
      }
      if (!validatePassword(formData.password)) {
        throw new Error("Password doesn't meet requirements")
      }

      const normalizedEmail = formData.email.toLowerCase().trim()

      // Setup signup options
      const signupOptions: any = {
        data: { username: formData.username.trim() }
      }

      // Only set emailRedirectTo in production
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
        signupOptions.emailRedirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: formData.password,
        options: signupOptions
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("No user returned")

      // Insert into public.users table
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: normalizedEmail,
          username: formData.username.trim(),
          role: 'user'
        })

      if (dbError) throw dbError

      // Check if email confirmation is needed
      if (authData.user?.identities?.length === 0) {
        setErrors(['Please check your email for a confirmation link'])
        return
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as Error
      console.error('Signup error:', error)

      if (error.message.includes('invalid email address')) {
        setErrors(['Please enter a valid email address'])
      } else if (error.message.includes('already registered')) {
        setErrors(['This email is already registered'])
      } else {
        setErrors([`Signup failed: ${error.message}`])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-background border border-foreground/10 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        {errors.length > 0 && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                emailError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-foreground/20 focus:ring-blue-500'
              } bg-background text-foreground`}
              required
              disabled={isSubmitting}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
              required
              disabled={isSubmitting}
            />
            <div className="mt-2 text-sm">
              <p className="font-medium">Password Requirements:</p>
              <ul className="list-disc list-inside">
                {requirements.map((req, i) => (
                  <li
                    key={i}
                    className={req.valid ? 'text-green-500' : 'text-foreground/60'}
                  >
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              onClick={() => router.push('/login')}
              disabled={isSubmitting}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

