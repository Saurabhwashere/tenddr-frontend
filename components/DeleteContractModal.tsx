'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react'
import { API_URL } from '@/lib/config'

interface DeleteContractModalProps {
  contractId: string
  filename: string
  onDelete: () => void
  onCancel: () => void
}

export default function DeleteContractModal({
  contractId,
  filename,
  onDelete,
  onCancel
}: DeleteContractModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`${API_URL}/contracts/${contractId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete contract')
      }

      const data = await response.json()
      
      if (data.success) {
        onDelete()
      } else {
        alert('Failed to delete contract completely. Some data may remain.')
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
      alert('Error deleting contract. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Delete Contract</h2>
              <p className="text-sm text-slate-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-sm text-red-800 mb-2">
            <strong>Warning:</strong> This will permanently delete:
          </p>
          <ul className="text-sm text-red-700 space-y-1 ml-4">
            <li>• PDF file from storage</li>
            <li>• All risk analysis data</li>
            <li>• All Q&A history</li>
            <li>• All embeddings from vector database</li>
          </ul>
        </div>

        {/* File Info */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-600 mb-1">Contract to delete:</p>
          <p className="font-semibold text-slate-900 break-all">{filename}</p>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-red-500 focus:outline-none"
            placeholder="DELETE"
            disabled={isDeleting}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || confirmText.toLowerCase() !== 'delete'}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

