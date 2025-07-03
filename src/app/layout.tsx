import './globals.css'
import { Metadata } from 'next'
import Navbar from '../../components/layouts/Navbar'
import Footer from '../../components/layouts/Footer'

export const metadata: Metadata = {
  title: 'Fanpage Tool - Manage Your Facebook Pages',
  description: 'All-in-one tool for managing Facebook fanpages, messages, posts, comments, and more.',
  keywords: ['fanpage', 'facebook', 'management', 'tool'],
  openGraph: {
    title: 'Fanpage Tool',
    description: 'All-in-one tool for managing Facebook fanpages.',
    url: 'https://yourdomain.com',
    siteName: 'Fanpage Tool',
    type: 'website',
  },
  alternates: {
    canonical: 'https://yourdomain.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Fanpage Tool",
            "url": "https://yourdomain.com"
          })
        }} />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}