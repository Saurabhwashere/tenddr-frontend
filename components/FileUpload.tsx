// FileUpload component - Simple drag & drop

'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '@clerk/nextjs'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { API_URL } from '@/lib/config'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete'>('idle')
  const router = useRouter()
  const { getToken, isLoaded, isSignedIn } = useAuth()
  
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
    
    // Check if user is authenticated
    if (!isLoaded || !isSignedIn) {
      toast.error('Please sign in to upload contracts')
      return
    }
    
    setLoading(true)
    setStage('uploading')
    setProgress(5)
    
    const formData = new FormData()
    formData.append('file', file)
    
    // Start continuous progress simulation with progressive slowdown
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Progressive slowdown: Fast at start, slow near end
        const increment = prev < 30 ? 5 :    // 5-30%: Fast (5% per second) 
                         prev < 60 ? 2 :    // 30-60%: Medium (2% per second)
                         prev < 80 ? 1 :    // 60-80%: Slower (1% per second)
                         prev < 95 ? 0.5 :  // 80-95%: Very slow (0.5% per second)
                         0;                 // 95%+: Stop (wait for completion)
        
        return Math.min(prev + increment, 95) // Never go above 95% until done
      })
    }, 1000) // Update every second
    
    try {
      // Get Clerk authentication token
      const token = await getToken()
      
      // Update stage messages as time progresses
      setTimeout(() => {
        if (stage !== 'complete') setStage('processing')
      }, 2000) // After 2 seconds
      
      setTimeout(() => {
        if (stage !== 'complete') setStage('analyzing')
      }, 10000) // After 10 seconds
      
      // Make the actual API call with authentication (this takes 2-3 minutes with optimizations)
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '', // Include auth token
        },
        body: formData
      })
      
      const data = await res.json()
      
      // Stop the progress simulation
      clearInterval(progressInterval)
      
      // Check if this is a duplicate contract
      if (data.is_duplicate) {
        setProgress(100)
        setStage('complete')
        toast.info('Contract already uploaded!', {
          description: 'Opening existing analysis...'
        })
        setTimeout(() => router.push(`/results/${data.id}`), 500)
        return
      }
      
      // Complete!
      setStage('complete')
      setProgress(100)
      
      toast.success('Analysis complete! Redirecting...')
      
      // Redirect to results page
      setTimeout(() => router.push(`/results/${data.id}`), 500)
    } catch (error) {
      clearInterval(progressInterval)
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