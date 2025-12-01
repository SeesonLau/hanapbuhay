import type { Metadata } from 'next'
import { inter, alexandria } from '@/styles/fonts';
import '../app/global.css'
import { Toaster } from 'react-hot-toast'
import { SupabaseHashHandler } from '@/components/auth/SupabaseHashHandler';
import EllipseBackground from '@/components/ui/EllipseBackground';

export const metadata: Metadata = {
  title: 'Hanapbuhay',
  description: 'Find jobs, get hired, and manage your career with Hanapbuhay.',
  icons: {
    icon: '/favicon.ico', 
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${alexandria.variable}`} >
      <body className="min-h-screen relative" suppressHydrationWarning>       
        <Toaster position="top-center" />
        <SupabaseHashHandler />
        <EllipseBackground />
        {children}
      </body>
    </html>
  )
}
