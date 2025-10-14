import type { Metadata } from 'next'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import LoadingBar from '@/components/LoadingBar'
import { Suspense } from 'react'
import './globals.css'

// Force dynamic rendering for Clerk components
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tenddr - AI-Powered Contract Analysis',
  description: 'AI-powered contract analysis finds hidden risks, compliance gaps, and financial exposure in minutes—not weeks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/upload"
      signUpFallbackRedirectUrl="/upload"
    >
      <html lang="en">
        <body>
          <LoadingBar />
          <header className="border-b bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center">
                  <Link href="/">
                    <h1 className="text-3xl font-extrabold text-slate-900 cursor-pointer hover:text-blue-600 transition-all">
                      Tenddr
                    </h1>
                  </Link>
                </div>
                
                <div className="flex items-center gap-6">
                  <Suspense fallback={<div className="w-24 h-10 bg-gray-200 animate-pulse rounded"></div>}>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="px-5 py-2.5 text-base font-medium text-slate-700 hover:text-slate-900 transition-colors">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignInButton mode="modal">
                        <button className="px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-all">
                          Get Started
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </Suspense>
                  <Suspense fallback={<div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>}>
                    <SignedIn>
                      <Link 
                        href="/upload"
                        className="px-5 py-2.5 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        Upload Contract
                      </Link>
                      <Link 
                        href="/contracts"
                        className="px-5 py-2.5 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        My Contracts
                      </Link>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-11 h-11"
                          }
                        }}
                      />
                    </SignedIn>
                  </Suspense>
                </div>
              </div>
            </div>
          </header>
          
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

