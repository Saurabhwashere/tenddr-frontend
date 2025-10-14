// Protected Upload Page
import FileUpload from '@/components/FileUpload'
import { Toaster } from 'sonner'
import { CheckCircle2, AlertTriangle, MessageCircle, FileCheck, Clock, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
      
      <div className="max-w-4xl mx-auto">
        {/* Simple Navigation */}
        <div className="flex justify-end mb-6">
          <Link 
            href="/contracts"
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border shadow-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            My Contracts
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Tenddr
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered contract analysis in seconds. Upload your PDF and get comprehensive insights instantly.
          </p>
        </div>
        
        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <FileUpload />
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Compliance Check</h3>
            <p className="text-sm text-gray-600">
              Verify all mandatory requirements and certifications
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-red-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Risk Analysis</h3>
            <p className="text-sm text-gray-600">
              Identify financial risks and potential issues
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <MessageCircle className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Smart Q&A</h3>
            <p className="text-sm text-gray-600">
              Ask questions and get instant answers with citations
            </p>
          </div>
        </div>
        
        {/* Additional Features */}
        <div className="bg-white/50 backdrop-blur rounded-xl p-6 border border-white">
          <p className="text-center text-sm text-gray-600 mb-4">
            <strong>7 Comprehensive Analyses Included:</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              <FileCheck className="inline w-3 h-3 mr-1" />
              Compliance
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              <AlertTriangle className="inline w-3 h-3 mr-1" />
              Clauses & Risks
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              Scope Alignment
            </span>
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full">
              Completeness
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
              <Clock className="inline w-3 h-3 mr-1" />
              Timeline
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
              <DollarSign className="inline w-3 h-3 mr-1" />
              Financial
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
              Audit Trail
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

