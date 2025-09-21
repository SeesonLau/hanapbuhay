// src/app/layout.tsx
import type { Metadata } from 'next'
import { inter, alexandria } from '@/styles/fonts';
import '../app/global.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${alexandria.variable}`} >
      <body className="min-h-screen relative">       
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  )
}