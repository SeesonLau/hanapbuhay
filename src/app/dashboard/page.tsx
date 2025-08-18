import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = supabaseServer()
  const { data: { session }, error } = await supabase.auth.getSession()

   if (error || !session) {
    redirect('/login')
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen">
      <header className="bg-background border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <form action="/auth/signout" method="POST">
            <button className="text-sm text-blue-500 hover:underline" type="submit">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-background border border-foreground/10 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium">Welcome, {user?.username || user?.email}</h2>
          <p className="mt-2 text-foreground/80">Role: {user?.role}</p>
          <p className="mt-2 text-foreground/80">Member since: {new Date(user?.created_at).toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  )
}
