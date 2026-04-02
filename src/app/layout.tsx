import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GPT Satış - AI Abonelik Yönetim Platformu',
  description: 'Paylaşımlı ChatGPT Business ekip üyeliği erişimi sağlayan premium platform',
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
