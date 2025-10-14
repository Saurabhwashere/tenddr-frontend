'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Clock, AlertTriangle, Loader2, Trash2 } from 'lucide-react'

interface ContractCardProps {
  contract: {
    id: string
    filename: string
    uploaded_at: string
    risk_level?: string
    questions_asked?: number
    critical_risks?: number
    high_risks?: number
  }
  onDeleteClick?: () => void
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

export default function ContractCard({ contract, onDeleteClick }: ContractCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    router.push(`/results/${contract.id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDeleteClick) {
      onDeleteClick()
    }
  }

  return (
    <div className="relative">
      <Link 
        href={`/results/${contract.id}`}
        onClick={handleClick}
        className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.01]"
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
              {contract.questions_asked && contract.questions_asked > 0 && (
                <span className="text-gray-500">
                  {contract.questions_asked} question{contract.questions_asked !== 1 ? 's' : ''} asked
                </span>
              )}
            </div>
          </div>
          
          {/* Right Side: Risk Badges and Delete Button */}
          <div className="flex items-center gap-2">
            {contract.critical_risks && contract.critical_risks > 0 && (
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                {contract.critical_risks} Critical
              </div>
            )}
            
            {contract.high_risks && contract.high_risks > 0 && !contract.critical_risks && (
              <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                {contract.high_risks} High
              </div>
            )}

            {/* Delete Button */}
            {onDeleteClick && (
              <button
                onClick={handleDeleteClick}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete contract"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl flex items-center justify-center z-10">
          <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-lg shadow-lg">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-slate-700 font-medium">Opening contract...</span>
          </div>
        </div>
      )}
    </div>
  )
}

