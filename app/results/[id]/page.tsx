// Results page - Comprehensive Contract Analysis

import ResultsView from '@/components/ResultsView'

async function getResults(id: string) {
  try {
    const res = await fetch(`http://localhost:8000/results/${id}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      console.error('Failed to fetch results:', error)
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching results:', error)
    return null
  }
}

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const data = await getResults(params.id)
  
  // Handle error case with friendly message
  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Contract Not Found</h1>
            <p className="text-gray-600 mb-4">
              The contract you're looking for is not available. This can happen if:
            </p>
            <ul className="text-left text-gray-600 mb-6 space-y-2">
              <li>• The backend server was restarted (clearing in-memory data)</li>
              <li>• The contract ID is incorrect</li>
              <li>• The upload did not complete successfully</li>
            </ul>
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              ← Upload New Contract
            </a>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <ResultsView
        contractId={data.id}
        filename={data.filename}
        compliance_checklist={data.compliance_checklist}
        clause_summaries={data.clause_summaries}
        scope_alignment={data.scope_alignment}
        completeness_check={data.completeness_check}
        timeline_milestones={data.timeline_milestones}
        financial_risks={data.financial_risks}
        audit_trail={data.audit_trail}
        validation={data.validation}
      />
    </main>
  )
}
