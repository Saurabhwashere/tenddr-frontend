// Contracts List Page
// Shows all uploaded contracts

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { API_URL } from '@/lib/config'
import Link from 'next/link'
import { FileText, Clock, AlertTriangle, Home } from 'lucide-react'

// Fetch all contracts from backend
async function getContracts() {
  try {
    const res = await fetch(`${API_URL}/contracts`, { 
      cache: 'no-store'  // Always get fresh data
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
  
  const contracts = await getContracts()
  
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
              href="/"
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
          <div className="grid gap-4">
            {contracts.map((contract: any) => (
              <Link 
                key={contract.id}
                href={`/results/${contract.id}`}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between">
                  {/* Left Side: Contract Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {contract.filename}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {/* Upload Date */}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(contract.uploaded_at)}
                      </span>
                      
                      {/* Risk Level Badge */}
                      {contract.risk_level && contract.risk_level !== 'unknown' && (
                        <span className={`flex items-center gap-1 px-2 py-1 rounded font-medium ${
                          contract.risk_level === 'critical' ? 'bg-red-100 text-red-700' :
                          contract.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                          contract.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          <AlertTriangle className="w-4 h-4" />
                          {contract.risk_level} risk
                        </span>
                      )}
                      
                      {/* Questions Asked */}
                      {contract.questions_asked > 0 && (
                        <span className="text-gray-500">
                          {contract.questions_asked} question{contract.questions_asked !== 1 ? 's' : ''} asked
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Side: Critical Risks Badge */}
                  {contract.critical_risks > 0 && (
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      {contract.critical_risks} Critical
                    </div>
                  )}
                  
                  {contract.high_risks > 0 && !contract.critical_risks && (
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                      {contract.high_risks} High
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

