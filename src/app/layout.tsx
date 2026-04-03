import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIPass - Premium Yapay Zeka',
  description: 'ChatGPT, GPT-5, Sora ve daha fazlası için paylaşımlı abonelik platformu.',
  keywords: ['ChatGPT', 'AI', 'abonelik', 'ekip üyeliği'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className="antialiased min-h-screen bg-surface-950">
        {children}
      </body>
    </html>
  )
}
