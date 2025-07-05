"use client";
import './globals.css'

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

        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}