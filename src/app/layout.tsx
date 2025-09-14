import type { Metadata } from 'next'
import '../app/global.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Hanapbuhay',
  description: 'dummy rani',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  )
}
