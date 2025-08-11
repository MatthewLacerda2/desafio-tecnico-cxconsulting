'use client'

import { useState, useEffect } from 'react'

interface Result {
  rootUrl: string
  url: string
  dateGenerated: string
  summary: string
  priority: 'low' | 'medium' | 'high'
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [filteredResults, setFilteredResults] = useState<Result[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Load results from API here
    // For now, populate with sample data
    const sampleResults: Result[] = [
      {
        rootUrl: 'example.com',
        url: 'https://example.com/product-page-1',
        dateGenerated: '2024-01-15',
        summary: 'Mobile optimization needed for better conversion rates',
        priority: 'high'
      },
      {
        rootUrl: 'shop.com',
        url: 'https://shop.com/category-page',
        dateGenerated: '2024-01-14',
        summary: 'Checkout flow improvements recommended',
        priority: 'medium'
      },
      {
        rootUrl: 'store.net',
        url: 'https://store.net/homepage',
        dateGenerated: '2024-01-13',
        summary: 'Trust signals implementation for user confidence',
        priority: 'low'
      },
      {
        rootUrl: 'ecommerce.org',
        url: 'https://ecommerce.org/product-detail',
        dateGenerated: '2024-01-12',
        summary: 'Navigation improvements for better user experience',
        priority: 'medium'
      }
    ]
    
    setResults(sampleResults)
    setFilteredResults(sampleResults)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults(results)
    } else {
      const filtered = results.filter(result => 
        result.rootUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.priority.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredResults(filtered)
    }
  }, [searchTerm, results])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CRO Results
          </h1>
          <p className="text-xl text-gray-600">
            View all generated CRO improvement reports
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="max-w-md mx-auto">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Results
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by URL, summary, or priority..."
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generated Reports</h2>
          
          {filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Root URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.rootUrl}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 break-all">
                        {result.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.dateGenerated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        {result.summary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(result.priority)}`}>
                          {result.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
