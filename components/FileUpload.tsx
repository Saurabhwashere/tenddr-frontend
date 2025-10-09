// FileUpload component - Simple drag & drop

'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete'>('idle')
  const router = useRouter()
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      toast.success(`${acceptedFiles[0].name} ready to upload`)
    }
  }, [])
  
  // Setup drag & drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  })
  
  const handleUpload = async () => {
    if (!file) return
    
    setLoading(true)
    setStage('uploading')
    setProgress(10)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Stage 1: Upload PDF
      setProgress(20)
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      })
      
      // Stage 2: Processing PDF
      setStage('processing')
      setProgress(40)
      
      // Stage 3: Running AI Analysis
      setStage('analyzing')
      setProgress(60)
      
      // Simulate incremental progress for 7 analyses
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 3, 95))
      }, 800)
      
      const data = await res.json()
      clearInterval(progressInterval)
      
      // Stage 4: Complete
      setStage('complete')
      setProgress(100)
      
      toast.success('Analysis complete! Redirecting...')
      
      // Redirect to results page
      setTimeout(() => router.push(`/results/${data.id}`), 500)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
      setLoading(false)
      setProgress(0)
      setStage('idle')
    }
  }
  
  // Simple stage messages
  const getStageMessage = () => {
    switch (stage) {
      case 'uploading': return 'Uploading PDF...'
      case 'processing': return 'Extracting text & creating chunks...'
      case 'analyzing': return 'Running 7 AI analyses...'
      case 'complete': return 'Complete! ✓'
      default: return ''
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          p-12 border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3 text-center">
          {loading ? (
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          {isDragActive ? (
            <p className="text-lg font-medium text-blue-600">
              Drop your PDF here...
            </p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                Drag & drop your PDF contract
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Selected File Preview */}
      {file && !loading && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-600">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
      )}
      
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="
          w-full px-6 py-4 rounded-lg font-semibold text-lg
          transition-all duration-200
          disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500
          bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg
        "
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Contract... {progress}%
          </span>
        ) : (
          'Analyze Contract'
        )}
      </button>
      
      {/* Progress with Stages */}
      {loading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            {getStageMessage()}
          </p>
        </div>
      )}
    </div>
  )
}