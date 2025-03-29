import { type Metadata } from "next"

import "./globals.css"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { dark } from "@clerk/themes"


export const metadata: Metadata = {
  title: 'Exavault',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body>
          <header className="flex justify-between items-center p-4 gap-4 h-16">
            <h1>Welcome to Exavault</h1>
            <SignedOut>
              <SignInButton mode="modal"/>
            </SignedOut>
            <SignedIn>
              <UserButton showName/>
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}