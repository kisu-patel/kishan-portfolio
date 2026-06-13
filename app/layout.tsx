import type { Metadata } from 'next'
import { Antonio, Inter } from 'next/font/google'
import './globals.css'
import GlobalCursor from '@/components/GlobalCursor'

const antonio = Antonio({
  subsets: ['latin'],
  variable: '--font-antonio',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kishanspatel.com'),
  title: 'Kishan S. Patel — UI / UX Designer',
  description: 'Product designer at Motadata crafting enterprise UX for ObserveOps — 4 years, 20+ modules. Based in Ahmedabad, India.',
  keywords: ['UI UX Designer', 'Product Designer', 'Figma', 'Enterprise UX', 'Dashboard Design', 'ObserveOps', 'Motadata', 'Ahmedabad'],
  authors: [{ name: 'Kishan S. Patel' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Kishan S. Patel — UI / UX Designer',
    description: 'Product designer at Motadata. 4 years crafting enterprise UX for ObserveOps — 20+ modules, full design system ownership.',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Kishan S. Patel — UI/UX Designer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kishan S. Patel — UI / UX Designer',
    description: 'Product designer at Motadata. Enterprise UX for ObserveOps.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${antonio.variable} ${inter.variable}`}>
      <body>
        {children}
        <GlobalCursor />
      </body>
    </html>
  )
}
