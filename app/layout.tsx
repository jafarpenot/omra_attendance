import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Omra 2026 — Jamat Sidi Abdallah',
  description: 'Inscription pour le voyage Omra 2026 — Jamat Sidi Abdallah',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ backgroundColor: '#0d2518', color: '#f0e8d5', fontFamily: 'Georgia, Palatino, serif' }}>
        {children}
      </body>
    </html>
  )
}
