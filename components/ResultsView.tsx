// ResultsView component - Simple tabbed interface for contract analysis

'use client'
import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { 
  FileCheck, AlertTriangle, Target, ClipboardCheck, 
  Clock, DollarSign, FileText, MessageCircle, Loader2,
  CheckCircle2, XCircle, ShieldAlert, Home, List, RefreshCw
} from 'lucide-react'
import { API_URL } from '@/lib/config'
import RiskDashboard from './RiskDashboard'
// PDF viewer removed

interface ResultsViewProps {
  contractId: string
  filename: string
  riskAnalysis?: any  // Risk analysis data from backend (optional)
  compliance_checklist: string
  clause_summaries: string
  scope_alignment: string
  completeness_check: string
  timeline_milestones: string
  financial_risks: string
  audit_trail: string
  validation: any
}

export default function ResultsView({ 
  contractId, 
  filename, 
  riskAnalysis,
  compliance_checklist,
  clause_summaries,
  scope_alignment,
  completeness_check,
  timeline_milestones,
  financial_risks,
  audit_trail,
  validation
}: ResultsViewProps) {
  // Simple tab state - just a string!
  const [activeTab, setActiveTab] = useState('risks')  // Start with risk analysis
  
  // Q&A state with chat history
  const [question, setQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([])
  const [loading, setLoading] = useState(false)
  
  // Re-analyze state
  const [reanalyzing, setReanalyzing] = useState(false)
  const [reanalyzeProgress, setReanalyzeProgress] = useState(0)
  
  // PDF viewer removed - page jumping functionality disabled
  
  // Make [Page X] citations as non-clickable badges (PDF viewer removed)
  const makePageLinksClickable = (text: string) => {
    if (!text) return null
    
    // Split by [Page X] pattern but keep the pattern
    const parts = text.split(/(\[Page \d+\])/g)
    
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          // Check if this part is a page reference
          const match = part.match(/\[Page (\d+)\]/)
          if (match) {
            const pageNum = parseInt(match[1])
            return (
              <span
                key={idx}
                className="inline-flex items-center mx-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                title={`Page ${pageNum} reference`}
              >
                📄 Page {pageNum}
              </span>
            )
          }
          // Regular text - preserve line breaks
          return part.split('\n').map((line, lineIdx) => (
            <span key={`${idx}-${lineIdx}`}>
              {line}
              {lineIdx < part.split('\n').length - 1 && <br />}
            </span>
          ))
        })}
      </div>
    )
  }

  const handleReanalyze = async () => {
    if (!confirm('Re-analyze this contract?\n\nThis will:\n• Update all risk detections with improved logic\n• Re-chunk document with enhanced metadata\n• Refresh all analysis results\n\nThis may take 3-5 minutes.')) {
      return
    }
    
    setReanalyzing(true)
    setReanalyzeProgress(5)
    
    // Start continuous progress simulation with progressive slowdown
    const progressInterval = setInterval(() => {
      setReanalyzeProgress(prev => {
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
      // Make the actual API call (this takes 3-5 minutes with hybrid LLM)
      const response = await fetch(`${API_URL}/reanalyze/${contractId}`, {
        method: 'POST'
      })
      
      // Stop the progress simulation
      clearInterval(progressInterval)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Re-analysis failed')
      }
      
      const result = await response.json()
      
      // Complete!
      setReanalyzeProgress(100)
      toast.success('Re-analysis complete! Refreshing results...')
      
      // Refresh page to show new results
      setTimeout(() => window.location.reload(), 1500)
      
    } catch (error: any) {
      clearInterval(progressInterval)
      toast.error('Re-analysis failed: ' + error.message)
      setReanalyzing(false)
      setReanalyzeProgress(0)
    }
  }

  const handleAskQuestion = async () => {
    if (!question.trim()) return
    
    const currentQuestion = question
    setLoading(true)
    
    try {
      const res = await fetch(`${API_URL}/qa/${contractId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion })
      })
      
      const data = await res.json()
      
      // Add to chat history
      setChatHistory([...chatHistory, { 
        question: currentQuestion, 
        answer: data.answer 
      }])
      
      setQuestion('') // Clear input for next question
      toast.success('Answer generated!')
    } catch (error) {
      console.error('Question error:', error)
      toast.error('Failed to get answer')
    }
    setLoading(false)
  }
  
  // Smart question suggestions based on content
  const getSmartQuestions = () => {
    const questions = []
    
    if (financial_risks && financial_risks.length > 100) {
      questions.push("What are the payment terms and penalties?")
      questions.push("What are the financial risks?")
    }
    
    if (timeline_milestones && timeline_milestones.length > 100) {
      questions.push("What are the key deadlines?")
    }
    
    if (compliance_checklist && compliance_checklist.length > 100) {
      questions.push("What documents are required?")
    }
    
    // Always include generic ones
    questions.push("Summarize the main obligations")
    questions.push("What are penalties for delays?")
    
    return questions
  }
  
  // Process text for better display
  const processText = (text: string) => {
    if (!text) return ''
    
    // Highlight numbers for better visibility
    let processed = text
    
    // Dates → yellow highlight
    processed = processed.replace(
      /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/g, 
      '**$1**'  // Make dates bold (Markdown will render)
    )
    
    return processed
  }

  // Simple tabs configuration - easy to understand
  const tabs = [
    { id: 'risks', name: 'Risk Analysis', icon: ShieldAlert, content: null, color: 'red' },  // Special tab for risk dashboard
    { id: 'compliance', name: 'Compliance', icon: FileCheck, content: compliance_checklist, color: 'blue' },
    { id: 'clauses', name: 'Clauses & Risks', icon: AlertTriangle, content: clause_summaries, color: 'purple' },
    { id: 'scope', name: 'Scope', icon: Target, content: scope_alignment, color: 'indigo' },
    { id: 'completeness', name: 'Completeness', icon: ClipboardCheck, content: completeness_check, color: 'teal' },
    { id: 'timeline', name: 'Timeline', icon: Clock, content: timeline_milestones, color: 'orange' },
    { id: 'financial', name: 'Financial', icon: DollarSign, content: financial_risks, color: 'red' },
    { id: 'audit', name: 'Audit Trail', icon: FileText, content: audit_trail, color: 'gray' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-[1920px] mx-auto">
        {/* Navigation */}
        <div className="flex justify-end gap-3 mb-6">
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border shadow-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link 
            href="/contracts"
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border shadow-sm font-medium"
          >
            <List className="w-4 h-4" />
            All Contracts
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Contract Analysis Report
              </h1>
              <p className="text-gray-600">
                <FileText className="inline w-4 h-4 mr-1" />
                {filename}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Re-analyze button with progress */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleReanalyze}
                  disabled={reanalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  title="Re-run analysis with latest improvements"
                >
                  {reanalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Re-analyzing... {reanalyzeProgress}%
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Re-analyze
                    </>
                  )}
                </button>
                
                {/* Progress bar */}
                {reanalyzing && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${reanalyzeProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {validation && (
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
                  ${validation.status === 'COMPLETE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }
                `}>
                  {validation.status === 'COMPLETE' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span>
                    {validation.sections_completed}/{validation.total_sections} Complete
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Single Column: Analysis Only */}
        <div className="space-y-6">
            {/* Tab Navigation - Simple horizontal scroll on mobile */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <div className="flex border-b border-gray-200 p-2 gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg font-medium
                    transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? `bg-${tab.color}-50 text-${tab.color}-700 shadow-sm` 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content - Just show/hide based on activeTab */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              {/* Special handling for Risk Analysis tab */}
              {tab.id === 'risks' ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldAlert className="w-6 h-6 text-red-600" />
                    <h2 className="text-2xl font-semibold text-red-600">
                      Automated Risk Detection
                    </h2>
                  </div>
                  <RiskDashboard 
                    riskAnalysis={riskAnalysis} 
                  />
                </>
              ) : (
                <>
                  {/* Regular tabs with text content */}
                  <div className="flex items-center gap-2 mb-4">
                    {(() => {
                      const Icon = tab.icon
                      return <Icon className={`w-6 h-6 text-${tab.color}-600`} />
                    })()}
                    <h2 className={`text-2xl font-semibold text-${tab.color}-600`}>
                      {tab.name}
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Headings - make them big and bold
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-gray-200 pb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2" {...props} />,
                        
                        // Strong text (from **text**) - treat as subheadings
                        strong: ({node, ...props}) => <strong className="text-lg font-bold text-gray-900 block mt-4 mb-2" {...props} />,
                        
                        // Lists - numbered and styled
                        ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="text-gray-700 leading-relaxed" {...props} />,
                        
                        // Paragraphs - good spacing
                        p: ({node, ...props}) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
                        
                        // Code/inline code
                        code: ({node, ...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
                      }}
                    >
                      {tab.content || 'No content available.'}
                    </ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Q&A Section with Chat History */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-green-600">
                Ask Questions
              </h2>
            </div>
            
            {/* Clear history button */}
            {chatHistory.length > 0 && (
              <button
                onClick={() => setChatHistory([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear History
              </button>
            )}
          </div>
          
          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
              {chatHistory.map((item, i) => (
                <div key={i} className="space-y-2">
                  {/* Question */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 font-semibold mb-1">You asked:</p>
                    <p className="text-sm text-gray-800">{item.question}</p>
                  </div>
                  
                  {/* Answer */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-2">Answer:</p>
                    <div className="text-sm text-gray-800 leading-relaxed">
                      {/* Render answer with clickable page citations */}
                      {makePageLinksClickable(item.answer)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Input */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about this contract..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleAskQuestion()}
            />
            <button
              onClick={handleAskQuestion}
              disabled={loading || !question.trim()}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Ask'
              )}
            </button>
          </div>
          
          {/* Smart Suggested Questions */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              {chatHistory.length === 0 ? 'Suggested questions:' : 'Ask another:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {getSmartQuestions().slice(0, 5).map(q => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="text-xs px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-full transition-all border border-gray-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

          </div>
      </div>
    </div>
  )
}
