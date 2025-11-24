'use client'
import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Search, Loader2, ChevronDown, ChevronUp, Download, Home, List, ZoomIn, ZoomOut, RefreshCw, Trash2 } from 'lucide-react'
import { API_URL } from '@/lib/config'
import { toast, Toaster } from 'sonner'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface SplitViewResultsProps {
  contract: any
}

interface OverviewTopic {
  id: string
  title: string
  question: string
  summary: string
  pageNumbers: string[]
  loading: boolean
}

export default function SplitViewResults({ contract }: SplitViewResultsProps) {
  const { userId } = useAuth()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeSection, setActiveSection] = useState('overview')
  const [zoom, setZoom] = useState(100)

  // Overview state - initialize from backend data if available
  const [overviewTopics, setOverviewTopics] = useState<OverviewTopic[]>(
    contract.contract_overview?.topics && contract.contract_overview.topics.length > 0
      ? contract.contract_overview.topics.map((topic: any) => ({
          ...topic,
          loading: false
        }))
      : [
          { 
            id: '1',
            title: 'Project Name', 
            question: 'What is the name of the project or contract?',
            summary: '',
            pageNumbers: [],
            loading: false
          },
          { 
            id: '2',
            title: 'Project Location', 
            question: 'Where is the project located? Include city, state, and any specific site details.',
            summary: '',
            pageNumbers: [],
            loading: false
          },
          { 
            id: '3',
            title: 'Payment Terms', 
            question: 'What are the payment terms? Include payment schedule, retention, and any key financial conditions.',
            summary: '',
            pageNumbers: [],
            loading: false
          },
          { 
            id: '4',
            title: 'Estimated Values', 
            question: 'What is the contract value or estimated project cost?',
            summary: '',
            pageNumbers: [],
            loading: false
          },
        ]
  )

  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newTopicQuestion, setNewTopicQuestion] = useState('')
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [reanalyzing, setReanalyzing] = useState(false)

  const pdfUrl = `${API_URL}/pdf/${contract.id}`

  const handleAskQuestion = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    setAnswer(null)
    
    try {
      const res = await fetch(`${API_URL}/qa/${contract.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId || ''
        },
        body: JSON.stringify({ question })
      })
      
      const data = await res.json()
      setAnswer(data.answer)
      toast.success('Answer generated!')
    } catch (error) {
      console.error('Question error:', error)
      toast.error('Failed to get answer')
    }
    setLoading(false)
  }

  // Fetch answer for a specific overview topic
  const fetchTopicAnswer = async (topicId: string, question: string) => {
    setOverviewTopics(prev => prev.map(t => 
      t.id === topicId ? { ...t, loading: true } : t
    ))
    
    try {
      // Step 1: Get detailed answer from Q&A endpoint (with RAG)
      const res = await fetch(`${API_URL}/qa/${contract.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId || ''
        },
        body: JSON.stringify({ question })
      })
      
      const data = await res.json()
      const answer = data.answer
      
      // Extract all page numbers from answer
      const pageMatches = answer.match(/\[Page (\d+)\]/g)
      const pageNumbers: string[] = pageMatches 
        ? Array.from(new Set(pageMatches.map((m: string) => m.match(/\d+/)?.[0] || ''))).filter(Boolean) as string[]
        : []
      
      // Remove page references for summarization
      const cleanAnswer = answer.replace(/\[Page \d+\]/g, '').trim()
      
      // Step 2: Summarize using dedicated endpoint (no RAG, just LLM)
      const summaryRes = await fetch(`${API_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId || ''
        },
        body: JSON.stringify({ 
          text: cleanAnswer,
          max_words: 300
        })
      })
      
      const summaryData = await summaryRes.json()
      const summary = summaryData.summary
      
      setOverviewTopics(prev => prev.map(t => 
        t.id === topicId 
          ? { ...t, summary, pageNumbers, loading: false }
          : t
      ))
      
      toast.success('Topic updated!')
    } catch (error) {
      console.error('Error fetching topic:', error)
      toast.error('Failed to fetch topic')
      setOverviewTopics(prev => prev.map(t => 
        t.id === topicId ? { ...t, loading: false } : t
      ))
    }
  }

  // Add a new custom topic and automatically fetch its answer
  const addCustomTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicQuestion.trim()) {
      toast.error('Please fill in both title and question')
      return
    }
    
    const newTopicId = Date.now().toString()
    const newTopic = {
      id: newTopicId,
      title: newTopicTitle,
      question: newTopicQuestion,
      summary: '',
      pageNumbers: [],
      loading: true  // Start loading immediately
    }
    
    // Add topic to list
    setOverviewTopics(prev => [...prev, newTopic])
    
    // Clear form and close
    const questionToFetch = newTopicQuestion
    setNewTopicTitle('')
    setNewTopicQuestion('')
    setShowAddTopic(false)
    
    // Automatically fetch the answer
    toast.info('Analyzing new topic...')
    await fetchTopicAnswer(newTopicId, questionToFetch)
  }

  // Delete a custom topic
  const deleteTopic = (topicId: string) => {
    setOverviewTopics(prev => prev.filter(t => t.id !== topicId))
    toast.success('Topic removed')
  }

  // Reanalyze contract
  const handleReanalyze = async () => {
    if (!confirm('This will re-run the entire analysis on this contract. This may take a few minutes. Continue?')) {
      return
    }

    setReanalyzing(true)
    
    try {
      const res = await fetch(`${API_URL}/reanalyze/${contract.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!res.ok) {
        throw new Error('Failed to reanalyze contract')
      }
      
      const data = await res.json()
      toast.success('Contract reanalyzed successfully! Refreshing page...')
      
      // Reload the page after 2 seconds to show updated results
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Reanalyze error:', error)
      toast.error('Failed to reanalyze contract')
      setReanalyzing(false)
    }
  }

  // Parse page citations and make them clickable
  const makePageLinksClickable = (text: string) => {
    if (!text) return null
    
    const parts = text.split(/(\[Page \d+\])/g)
    
    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          const match = part.match(/\[Page (\d+)\]/)
          if (match) {
            const pageNum = parseInt(match[1])
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(pageNum)
                  toast.success(`Jumped to Page ${pageNum}`)
                }}
                className="inline-flex items-center mx-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium cursor-pointer transition-colors shadow-sm"
                title={`Jump to Page ${pageNum}`}
              >
                📄 Page {pageNum}
              </button>
            )
          }
          // Preserve line breaks and formatting
          return (
            <span key={idx} className="whitespace-pre-wrap">
              {part}
            </span>
          )
        })}
      </div>
    )
  }

  // Custom components for ReactMarkdown to handle page citations
  const markdownComponents = {
    p: ({ children, ...props }: any) => {
      // Convert children to string to check for page citations
      const text = children?.toString() || ''
      const hasPageCitation = /\[Page \d+\]/.test(text)
      
      if (hasPageCitation && typeof children === 'string') {
        // Split by page citations and make them clickable
        const parts = children.split(/(\[Page \d+\])/g)
        return (
          <p className="mb-4 leading-relaxed" {...props}>
            {parts.map((part: string, idx: number) => {
              const match = part.match(/\[Page (\d+)\]/)
              if (match) {
                const pageNum = parseInt(match[1])
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(pageNum)
                      toast.success(`Jumped to Page ${pageNum}`)
                    }}
                    className="inline-flex items-center mx-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium cursor-pointer transition-colors shadow-sm"
                  >
                    📄 Page {pageNum}
                  </button>
                )
              }
              return <span key={idx}>{part}</span>
            })}
          </p>
        )
      }
      return <p className="mb-4 leading-relaxed" {...props}>{children}</p>
    },
    h1: ({ children, ...props }: any) => (
      <h1 className="text-2xl font-bold text-emerald-900 mt-6 mb-4 pb-2 border-b-2 border-emerald-200" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl font-bold text-emerald-800 mt-5 mb-3 pb-2 border-b border-emerald-200" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-lg font-bold text-emerald-700 mt-4 mb-2" {...props}>{children}</h3>
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-emerald-900" {...props}>{children}</strong>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside ml-4 mb-4 space-y-2" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside ml-4 mb-4 space-y-2" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-gray-700 leading-relaxed" {...props}>{children}</li>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-emerald-300 pl-4 italic my-4 text-gray-600" {...props}>{children}</blockquote>
    ),
  }

  // Tab navigation
  const tabs = [
    { id: 'overview', name: 'Overview', icon: List },
    { id: 'scope', name: 'Scope', icon: null },
    { id: 'risks', name: 'Risks', icon: null },
    { id: 'financial', name: 'Financial', icon: null },
    { id: 'timeline', name: 'Timeline', icon: null },
    { id: 'bid-criteria', name: 'Bid Criteria', icon: null },
    { id: 'search', name: 'Search', icon: Search },
  ]

  // Suggested questions
  const suggestedQuestions = [
    'What are the penalties for delayed payments by the client?',
    'What are the payment terms and schedules?',
    'What are the key deadlines and milestones?',
    'What certifications and licenses are required?',
    'What are the termination clauses?',
  ]

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="border-b px-6 py-3 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <h1 className="font-semibold text-gray-900 text-lg truncate max-w-md" title={contract.filename}>
            {contract.filename}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Page Navigation */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Previous page"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">Page</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border rounded text-center text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              min="1"
            />
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Next page"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Navigation Links */}
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed border border-blue-700 font-medium transition-colors"
            title="Re-run complete analysis on this contract"
          >
            {reanalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Reanalyzing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Reanalyze
              </>
            )}
          </button>
          <Link 
            href="/contracts"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 border font-medium"
          >
            <List className="w-4 h-4" />
            All Contracts
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 border font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Q&A and Analysis */}
        <div className="w-1/2 border-r flex flex-col bg-white">
          {/* Tab Navigation */}
          <div className="border-b bg-gray-50 px-6 py-3 flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeSection === tab.id
                      ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {tab.name}
                </button>
              )
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Section */}
            {activeSection === 'search' && (
              <div className="p-6 space-y-6">
                {/* Search Box */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Search
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What are the penalties for delayed payments by the client? Give reasons why some of these can be unfair for the contractor?"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !loading) {
                        e.preventDefault()
                        handleAskQuestion()
                      }
                    }}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={loading || !question.trim()}
                    className="mt-3 w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing contract...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search Contract
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    💡 Tip: Click on page citations in the answer to jump to that page in the PDF
                  </p>
                </div>

                {/* Answer Display */}
                {answer && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200 shadow-md">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-300">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-emerald-900">
                        Analysis Results
                      </h3>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Suggested Questions */}
                {!answer && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Suggested Questions:
                    </p>
                    <div className="space-y-2">
                      {suggestedQuestions.map(q => (
                        <button
                          key={q}
                          onClick={() => setQuestion(q)}
                          className="w-full text-left px-4 py-3 text-sm bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-emerald-300 rounded-lg text-gray-700 transition-all shadow-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scope Section */}
            {activeSection === 'scope' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                  🎯 Scope Alignment
                </h2>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {contract.scope_alignment || 'No scope data available.'}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Risks Section */}
            {activeSection === 'risks' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                  🛡️ Risk Analysis
                </h2>

                {/* Risk Summary Cards */}
                {contract.risk_analysis?.summary && (
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 uppercase">Critical</p>
                      <p className="text-3xl font-bold text-red-700 mt-1">
                        {contract.risk_analysis.summary.critical_count}
                      </p>
                    </div>
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 uppercase">High</p>
                      <p className="text-3xl font-bold text-orange-700 mt-1">
                        {contract.risk_analysis.summary.high_count}
                      </p>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 uppercase">Medium</p>
                      <p className="text-3xl font-bold text-yellow-700 mt-1">
                        {contract.risk_analysis.summary.medium_count}
                      </p>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 uppercase">Low</p>
                      <p className="text-3xl font-bold text-blue-700 mt-1">
                        {contract.risk_analysis.summary.low_count}
                      </p>
                    </div>
                  </div>
                )}

                {/* Risks Table */}
                {contract.risk_analysis?.risks_by_severity ? (
                  <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200" style={{ fontFamily: 'Times New Roman, serif' }}>
                    <table className="w-full">
                      <thead className="bg-red-50 border-b border-red-200">
                        <tr>
                          <th className="px-4 py-4 text-left text-sm font-semibold text-red-900 w-32">
                            Clause
                          </th>
                          <th className="px-4 py-4 text-left text-sm font-semibold text-red-900 w-1/4">
                            Evidence
                          </th>
                          <th className="px-4 py-4 text-left text-sm font-semibold text-red-900 w-1/3">
                            Summary
                          </th>
                          <th className="px-4 py-4 text-center text-sm font-semibold text-red-900 w-24">
                            Risk Level
                          </th>
                          <th className="px-4 py-4 text-center text-sm font-semibold text-red-900 w-28">
                            Page Number
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Helper functions for extracting clause and pages */}
                        {(() => {
                          const extractClause = (text: string) => {
                            const match = text?.match(/(Clause|Section|Article|Appendix|Schedule)\s+[\dIVXA-Z.]+/i)
                            return match ? match[0] : 'N/A'
                          }
                          
                          const extractPages = (text: string, pageRefs: number[]) => {
                            if (pageRefs && pageRefs.length > 0) return pageRefs
                            const matches = text?.match(/\[?Page\s+(\d+)\]?/gi)
                            if (!matches) return []
                            return matches.map(m => parseInt(m.match(/\d+/)?.[0] || '0')).filter(p => p > 0)
                          }

                          const allRisks = [
                            ...(contract.risk_analysis.risks_by_severity.critical || []).map((r: any) => ({ ...r, severity: 'critical' })),
                            ...(contract.risk_analysis.risks_by_severity.high || []).map((r: any) => ({ ...r, severity: 'high' })),
                            ...(contract.risk_analysis.risks_by_severity.medium || []).map((r: any) => ({ ...r, severity: 'medium' })),
                            ...(contract.risk_analysis.risks_by_severity.low || []).map((r: any) => ({ ...r, severity: 'low' })),
                          ]

                          return allRisks.map((risk: any, idx: number) => {
                            const clause = extractClause(risk.evidence || '')
                            const pages = extractPages(risk.evidence || '', risk.page_references || [])
                            
                            // Create summary from impact and recommendation
                            const summary = []
                            if (risk.impact) {
                              summary.push(`Impact: ${risk.impact}`)
                            }
                            if (risk.recommendation) {
                              summary.push(`Recommendation: ${risk.recommendation}`)
                            }
                            const summaryText = summary.length > 0 ? summary.join('\n\n') : 'No summary available'
                            
                            const severityColors = {
                              critical: { bg: 'hover:bg-red-50', badge: 'bg-red-100 text-red-800' },
                              high: { bg: 'hover:bg-orange-50', badge: 'bg-orange-100 text-orange-800' },
                              medium: { bg: 'hover:bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800' },
                              low: { bg: 'hover:bg-blue-50', badge: 'bg-blue-100 text-blue-800' },
                            }

                            const colors = severityColors[risk.severity as keyof typeof severityColors]

                            return (
                              <tr key={`${risk.severity}-${idx}`} className={`${colors.bg} transition-colors`}>
                                <td className="px-4 py-6 align-top">
                                  <div className="font-medium text-gray-900 text-base">{clause}</div>
                                  <div className="text-sm text-gray-500 mt-2">{risk.risk_type}</div>
                                </td>
                                <td className="px-4 py-6 text-base text-gray-700 align-top leading-relaxed">
                                  <div className="whitespace-pre-wrap">
                                    {risk.evidence || 'No evidence provided'}
                                  </div>
                                </td>
                                <td className="px-4 py-6 text-base text-gray-700 align-top leading-relaxed">
                                  <div className="whitespace-pre-wrap">
                                    {summaryText}
                                  </div>
                                </td>
                                <td className="px-4 py-6 text-center align-top">
                                  <span className={`inline-flex items-center px-3 py-1 ${colors.badge} rounded-full text-xs font-semibold uppercase`}>
                                    {risk.severity}
                                  </span>
                                </td>
                                <td className="px-4 py-6 text-center align-top">
                                  {pages.length > 0 ? (
                                    <div className="flex flex-col gap-2 items-center">
                                      {pages.map((page: number, pidx: number) => (
                                        <button
                                          key={pidx}
                                          onClick={() => {
                                            setCurrentPage(page)
                                            toast.success(`Jumped to Page ${page}`)
                                          }}
                                          className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium cursor-pointer transition-colors"
                                        >
                                          📄 Page {page}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })
                        })()}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No risk analysis data available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Financial Section */}
            {activeSection === 'financial' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  💰 Financial Analysis
                </h2>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {contract.financial_risks || 'No financial data available.'}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-emerald-600">
                    📊 Contract Overview
                  </h2>
                  <button
                    onClick={() => setShowAddTopic(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <span className="text-lg">+</span>
                    Add Topic
                  </button>
                </div>

                {/* Overview Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200" style={{ fontFamily: 'Times New Roman, serif' }}>
                  <table className="w-full">
                    <thead className="bg-emerald-50 border-b border-emerald-200">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900 w-1/4">
                          Topic
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-emerald-900">
                          Summary
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-emerald-900 w-32">
                          Pages
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-emerald-900 w-20">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {overviewTopics.map((topic) => (
                        <tr key={topic.id} className="hover:bg-emerald-50 transition-colors">
                          <td className="px-4 py-6 align-top">
                            <div className="font-medium text-gray-900 text-base">{topic.title}</div>
                            <div className="text-sm text-gray-500 mt-2">{topic.question}</div>
                          </td>
                          <td className="px-4 py-6 text-base text-gray-700 align-top leading-relaxed">
                            {topic.loading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                <span className="text-gray-500">Loading...</span>
                              </div>
                            ) : topic.summary ? (
                              <div className="prose prose-base max-w-none">
                                <ReactMarkdown 
                                  remarkPlugins={[remarkGfm]}
                                  components={markdownComponents}
                                >
                                  {topic.summary}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Not available</span>
                            )}
                          </td>
                          <td className="px-4 py-6 text-center align-top">
                            {topic.pageNumbers && topic.pageNumbers.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {topic.pageNumbers.map((pageNum: string, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setCurrentPage(parseInt(pageNum))
                                      toast.success(`Jumped to Page ${pageNum}`)
                                    }}
                                    className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium cursor-pointer transition-colors"
                                  >
                                    📄 {pageNum}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-6 text-center align-top">
                            <button
                              onClick={() => deleteTopic(topic.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remove topic"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Click on page numbers to jump to that section in the PDF. 
                    The overview is automatically generated during contract analysis using AI to extract key information.
                  </p>
                </div>
              </div>
            )}

            {/* Timeline Section */}
            {activeSection === 'timeline' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">
                  ⏱️ Timeline & Milestones
                </h2>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {contract.timeline_milestones || 'No timeline data available.'}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Bid Qualifying Criteria Section */}
            {activeSection === 'bid-criteria' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">
                  📋 Bid Qualifying Criteria
                </h2>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {contract.bid_qualifying_criteria || 'No bid criteria data available.'}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: PDF Viewer */}
        <div className="w-1/2 bg-gray-100 flex flex-col">
          {/* PDF Controls */}
          <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href={pdfUrl}
                download
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>

          {/* PDF Display */}
          <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-4">
            <div 
              className="bg-white shadow-2xl"
              style={{ 
                width: `${zoom}%`,
                minWidth: '600px',
                maxWidth: '100%'
              }}
            >
              <iframe
                src={`${pdfUrl}#page=${currentPage}&zoom=${zoom}`}
                className="w-full border-0"
                style={{ height: '85vh' }}
                title="Contract PDF"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-900">Add Custom Topic</h3>
              <button
                onClick={() => {
                  setShowAddTopic(false)
                  setNewTopicTitle('')
                  setNewTopicQuestion('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Add a custom topic to extract specific information from the contract using AI.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g., Completion Timeline"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question to Ask
                </label>
                <textarea
                  value={newTopicQuestion}
                  onChange={(e) => setNewTopicQuestion(e.target.value)}
                  placeholder="e.g., What is the project completion timeline and key milestones?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={addCustomTopic}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-sm hover:shadow-md"
                >
                  Add Topic
                </button>
                <button
                  onClick={() => {
                    setShowAddTopic(false)
                    setNewTopicTitle('')
                    setNewTopicQuestion('')
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

