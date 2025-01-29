import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import type { Metadata } from "next"
import type React from "react" // Import React

export const metadata: Metadata = {
  title: "Foodie - Fresh Local Produce",
  description: "Optimizing Local Freshness Minimizing Global Footprint",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body>
            {children}
          </body>
          <Toaster />
        </ThemeProvider>
      </html>
    </ClerkProvider>
  )
}


