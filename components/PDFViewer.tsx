// Simple PDF Viewer Component
// Uses browser's native PDF viewer (simple and reliable)

'use client'
import { Download, ExternalLink } from 'lucide-react'

interface PDFViewerProps {
  contractId: string
  apiUrl: string
}

export default function PDFViewer({ contractId, apiUrl }: PDFViewerProps) {
  // Build the PDF URL from backend
  const pdfUrl = `${apiUrl}/pdf/${contractId}`
  
  return (
    <div className="border rounded-lg overflow-hidden bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white p-3 flex items-center justify-between border-b">
        <span className="text-sm font-medium text-gray-700">
          PDF Document
        </span>
        
        <div className="flex gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </a>
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
      
      {/* PDF Display using iframe - Simple and reliable */}
      <iframe
        src={pdfUrl}
        className="w-full h-[800px] border-0"
        title="Contract PDF"
      />
    </div>
  )
}

