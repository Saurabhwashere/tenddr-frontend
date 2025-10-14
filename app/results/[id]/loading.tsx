// Loading state for individual contract results
export default function ResultsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="h-8 w-96 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
          <div className="flex gap-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Risks Section Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-gray-200 bg-gray-50 p-4 rounded-r-lg">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Loading Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-xl shadow-lg">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-blue-200 rounded-full"></div>
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div>
              <div className="text-slate-900 font-semibold">Analyzing Contract...</div>
              <div className="text-slate-600 text-sm">This may take a few moments</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

