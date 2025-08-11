'use client'

import { useState, useEffect } from 'react'

interface Result {
  rootUrl: string
  url: string
  dateGenerated: string
  summary: string
  improvementsSummary: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [filteredResults, setFilteredResults] = useState<Result[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async (filter: string = '') => {
    try {
      setLoading(true)
      setError(null)
      
      const params = filter ? `?filter=${encodeURIComponent(filter)}` : ''
      const response = await fetch(`/api/results${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }
      
      const data = await response.json()
      setResults(data.results)
      setFilteredResults(data.results)
    } catch (err) {
      console.error('Error fetching results:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults(results)
    } else {
      const filtered = results.filter(result => 
        result.rootUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.improvementsSummary.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredResults(filtered)
    }
  }, [searchTerm, results])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <p className="font-bold text-lg">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => fetchResults()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            CRO Results
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            View all generated CRO improvement reports
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
          <div className="max-w-md mx-auto">
            <label htmlFor="search" className="block text-sm font-semibold text-slate-700 mb-3">
              Search Results
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 bg-white transition-all duration-200 hover:border-slate-300"
              placeholder="Search by URL, summary, or priority..."
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-3xl font-semibold text-slate-800 mb-6">Generated Reports</h2>
          
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No results found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Root URL</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Full URL</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date Generated</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Summary</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Improvements Summary</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredResults.map((result, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {result.rootUrl}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-700 break-all">
                        {result.url}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-700">
                        {new Date(result.dateGenerated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-700 max-w-xs leading-relaxed">
                        {result.summary}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-700 max-w-xs leading-relaxed">
                        {result.improvementsSummary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/30 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
