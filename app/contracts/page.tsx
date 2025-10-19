// Contracts List Page
// Shows all uploaded contracts

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { API_URL } from '@/lib/config'
import Link from 'next/link'
import { FileText, Home } from 'lucide-react'
import ContractsList from '@/components/ContractsList'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Fetch contracts for authenticated user from backend
async function getContracts(userId: string) {
  try {
    const res = await fetch(`${API_URL}/contracts`, { 
      cache: 'no-store',  // Always get fresh data
      headers: {
        'X-User-Id': userId
      }
    })
    
    if (!res.ok) {
      console.error('Failed to fetch contracts')
      return []
    }
    
    const data = await res.json()
    return data.contracts || []
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return []
  }
}

// Simple helper to format dates
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return 'Unknown date'
  }
}

export default async function ContractsPage() {
  // Require authentication
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  
  const contracts = await getContracts(userId)
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Contracts
            </h1>
            <p className="text-gray-600">
              {contracts.length} contract{contracts.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              href="/upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              + Upload New
            </Link>
          </div>
        </div>
        
        {/* Empty State */}
        {contracts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Contracts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Upload your first contract to get started with AI analysis
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Upload Contract
            </Link>
          </div>
        ) : (
          /* Contracts Grid */
          <ContractsList initialContracts={contracts} />
        )}
      </div>
    </main>
  )
}

