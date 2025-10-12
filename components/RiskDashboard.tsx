// RiskDashboard - Simple risk analysis display
// Shows summary cards and detailed risk list

'use client'
import { AlertTriangle, ShieldAlert, AlertCircle, Info, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Type definitions - matches backend structure
interface RiskAnalysis {
  summary: {
    total_risks_checked: number
    total_risks_found: number
    critical_count: number
    high_count: number
    medium_count: number
    low_count: number
    overall_risk_level: string
  }
  risks_by_severity: {
    critical: Risk[]
    high: Risk[]
    medium: Risk[]
    low: Risk[]
  }
}

interface Risk {
  risk_type: string
  severity: string
  detected: boolean
  evidence: string
  page_references: number[]
  impact: string
  recommendation: string
}

interface Props {
  riskAnalysis?: RiskAnalysis  // Optional - might not be available
}

export default function RiskDashboard({ riskAnalysis }: Props) {
  // Safety check - handle undefined or missing data
  if (!riskAnalysis || !riskAnalysis.summary) {
    return (
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Risk analysis data not available.</p>
      </div>
    )
  }
  
  const { summary, risks_by_severity } = riskAnalysis

  // Severity color mapping - Simple!
  const severityColors = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-800'
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800'
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    low: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800'
    }
  }

  // Summary card component - reusable
  const SummaryCard = ({ 
    severity, 
    count, 
    icon: Icon 
  }: { 
    severity: 'critical' | 'high' | 'medium' | 'low'
    count: number
    icon: any 
  }) => {
    const colors = severityColors[severity]
    return (
      <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase">{severity}</p>
            <p className={`text-3xl font-bold ${colors.text} mt-1`}>{count}</p>
          </div>
          <Icon className={`w-8 h-8 ${colors.icon}`} />
        </div>
      </div>
    )
  }

  // PDF viewer removed - page jumping functionality disabled

  // Risk card component - displays individual risk
  const RiskCard = ({ risk, severity }: { risk: Risk, severity: 'critical' | 'high' | 'medium' | 'low' }) => {
    const colors = severityColors[severity]
    
    // Extract page numbers from evidence text (look for [Page X] patterns)
    const extractPageNumbers = (text: string): number[] => {
      if (!text) return []
      
      // Try multiple patterns to catch different formats including incomplete brackets
      const patterns = [
        /\[Page (\d+(?:\.\d+)?)\]/g,  // [Page 74]
        /\[Page (\d+(?:\.\d+)?)/g,    // [Page 74 (missing closing bracket)
        /Page (\d+(?:\.\d+)?)/g,      // Page 74 (without brackets)
        /page (\d+(?:\.\d+)?)/g,      // page 74 (lowercase)
      ]
      
      const pageNumbers = new Set<number>()
      
      for (const pattern of patterns) {
        const matches = text.match(pattern)
        if (matches) {
          matches.forEach(match => {
            const pageMatch = match.match(/(\d+(?:\.\d+)?)/)
            if (pageMatch) {
              const pageNum = Math.floor(parseFloat(pageMatch[1]))
              if (pageNum > 0) {
                pageNumbers.add(pageNum)
              }
            }
          })
        }
      }
      
      return Array.from(pageNumbers).sort((a, b) => a - b)
    }
    
    // Extract clause/section references from evidence
    const extractClauseReference = (text: string): string | null => {
      if (!text) return null
      // Look for patterns like "Clause 3.2", "Section 5", "Article IV", etc.
      const match = text.match(/(Clause|Section|Article|Appendix|Schedule)\s+[\dIVXA-Z.]+:?\s*[^.\n]*/i)
      return match ? match[0] : null
    }
    
    const pageNumbers = risk.page_references || extractPageNumbers(risk.evidence || '')
    const clauseRef = extractClauseReference(risk.evidence || '')
    
    return (
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-3`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h4 className={`font-semibold ${colors.text} text-lg`}>
            {risk.risk_type}
          </h4>
          <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
            {severity}
          </span>
        </div>

        {/* Citations - Prominent display at top */}
        {(pageNumbers.length > 0 || clauseRef) && (
          <div className="mb-4 p-3 bg-white/50 rounded-lg border border-gray-300">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Citations</p>
                {clauseRef && (
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    📄 {clauseRef}
                  </p>
                )}
                {pageNumbers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pageNumbers.map((page, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        title={`Page ${page} reference`}
                      >
                        📄 Page {page}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Evidence */}
        {risk.evidence && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Evidence:</p>
            <div className="text-sm text-gray-600 prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {risk.evidence}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Impact */}
        {risk.impact && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Impact:</p>
            <p className="text-sm text-gray-600">{risk.impact}</p>
          </div>
        )}

        {/* Recommendation */}
        {risk.recommendation && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Recommendation:</p>
            <p className="text-sm text-gray-600">{risk.recommendation}</p>
          </div>
        )}
      </div>
    )
  }

  // If no risks found
  if (summary.total_risks_found === 0) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 mb-2">✓</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">No Major Risks Detected</h3>
        <p className="text-green-700">
          The automated risk analysis did not find any critical, high, or medium risks in this contract.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard severity="critical" count={summary.critical_count} icon={ShieldAlert} />
          <SummaryCard severity="high" count={summary.high_count} icon={AlertTriangle} />
          <SummaryCard severity="medium" count={summary.medium_count} icon={AlertCircle} />
          <SummaryCard severity="low" count={summary.low_count} icon={Info} />
        </div>
        
        {/* Overall Risk Level */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Overall Risk Level: </span>
          <span className={`font-bold text-lg ${
            summary.overall_risk_level === 'critical' ? 'text-red-600' :
            summary.overall_risk_level === 'high' ? 'text-orange-600' :
            summary.overall_risk_level === 'medium' ? 'text-yellow-600' :
            'text-blue-600'
          }`}>
            {summary.overall_risk_level.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Critical Risks */}
      {risks_by_severity.critical.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-red-700 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Critical Risks ({risks_by_severity.critical.length})
          </h3>
          {risks_by_severity.critical.map((risk, idx) => (
            <RiskCard key={idx} risk={risk} severity="critical" />
          ))}
        </div>
      )}

      {/* High Risks */}
      {risks_by_severity.high.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-orange-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            High Risks ({risks_by_severity.high.length})
          </h3>
          {risks_by_severity.high.map((risk, idx) => (
            <RiskCard key={idx} risk={risk} severity="high" />
          ))}
        </div>
      )}

      {/* Medium Risks */}
      {risks_by_severity.medium.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Medium Risks ({risks_by_severity.medium.length})
          </h3>
          {risks_by_severity.medium.map((risk, idx) => (
            <RiskCard key={idx} risk={risk} severity="medium" />
          ))}
        </div>
      )}

      {/* Low Risks */}
      {risks_by_severity.low.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Low Risks ({risks_by_severity.low.length})
          </h3>
          {risks_by_severity.low.map((risk, idx) => (
            <RiskCard key={idx} risk={risk} severity="low" />
          ))}
        </div>
      )}
    </div>
  )
}

