import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = supabaseServer()
  const { email, password, username } = await request.json()

  // Server-side password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
  if (!passwordRegex.test(password)) {
    return NextResponse.json(
      { error: 'Password does not meet requirements' },
      { status: 400 }
    )
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (authError) throw authError

    const { error: dbError } = await supabase
      .from('users')
      .insert({
        email,
        username,
        role: 'user',
        created_by: authData.user?.id,
        updated_by: authData.user?.id
      })

    if (dbError) throw dbError

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    )
  }
}
