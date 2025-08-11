'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CROAnalysis, Improvement } from '@/types/cro'

export default function ReportPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url') || 'Unknown URL'
  
  const [pageSummaryList, setPageSummaryList] = useState<string>('')
  const [estimatedConversionRate, setEstimatedConversionRate] = useState<string>('')
  const [bounceRate, setBounceRate] = useState<string>('')
  const [averageTimeOnPage, setAverageTimeOnPage] = useState<string>('')
  const [cartAbandonRate, setCartAbandonRate] = useState<string>('')
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [expectedConversionRate, setExpectedConversionRate] = useState<string>('')
  const [expectedBounceRate, setExpectedBounceRate] = useState<string>('')
  const [expectedTimeOnPage, setExpectedTimeOnPage] = useState<string>('')
  const [expectedCartAbandonRate, setExpectedCartAbandonRate] = useState<string>('')
  const [recommendationsSummary, setRecommendationsSummary] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const analyzeUrl = async () => {
      try {
        setLoading(true)
        setError('')
        
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.status}`)
        }

        const data = await response.json()
        
        // Parse the Gemini response (it's already structured JSON)
        let analysis: CROAnalysis
        try {
          analysis = JSON.parse(data.analysis)
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError)
          throw new Error('Invalid analysis response format')
        }

        // Update state with real data
        setPageSummaryList(analysis.pageSummaryList)
        setEstimatedConversionRate(analysis.currentMetrics.estimatedConversionRate)
        setBounceRate(analysis.currentMetrics.bounceRate)
        setAverageTimeOnPage(analysis.currentMetrics.averageTimeOnPage)
        setCartAbandonRate(analysis.currentMetrics.cartAbandonRate)
        setImprovements(analysis.improvements)
        setExpectedConversionRate(analysis.expectedResults.expectedConversionRate)
        setExpectedBounceRate(analysis.expectedResults.expectedBounceRate)
        setExpectedTimeOnPage(analysis.expectedResults.expectedTimeOnPage)
        setExpectedCartAbandonRate(analysis.expectedResults.expectedCartAbandonRate)
        setRecommendationsSummary(analysis.recommendationsSummary)

      } catch (error) {
        console.error('Analysis error:', error)
        setError(error instanceof Error ? error.message : 'Failed to analyze URL')
      } finally {
        setLoading(false)
      }
    }

    if (url && url !== 'Unknown URL') {
      analyzeUrl()
    }
  }, [url])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
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
          <p className="text-gray-600">Analyzing webpage...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Analysis Failed</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
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
            CRO Report
          </h1>
          <p className="text-xl text-gray-600 break-all">
            {url}
          </p>
        </div>

        {/* Page Summary List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{pageSummaryList}</p>
          </div>
        </div>

        {/* Current Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Metrics</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <span className="font-medium">Estimated Conversion Rate:</span>
              <span className="ml-2 text-gray-600">{estimatedConversionRate}</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <span className="font-medium">Bounce Rate:</span>
              <span className="ml-2 text-gray-600">{bounceRate}</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <span className="font-medium">Average Time on Page:</span>
              <span className="ml-2 text-gray-600">{averageTimeOnPage}</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <span className="font-medium">Cart Abandon Rate:</span>
              <span className="ml-2 text-gray-600">{cartAbandonRate}</span>
            </li>
          </ul>
        </div>

        {/* Recommended Improvements Table */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Improvements</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Impact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {improvements.map((improvement, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {improvement.recommended_improvements}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {improvement.summary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(improvement.priority)}`}>
                        {improvement.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(improvement.expected_impact)}`}>
                        {improvement.expected_impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expected Results */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expected Results After Improvements</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium">Expected Conversion Rate:</span>
              <span className="ml-2 text-gray-600">{expectedConversionRate}</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium">Expected Bounce Rate:</span>
              <span className="ml-2 text-gray-600">{expectedBounceRate}</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium">Expected Time on Page:</span>
              <span className="ml-2 text-gray-600">{expectedTimeOnPage}</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium">Expected Cart Abandon Rate:</span>
              <span className="ml-2 text-gray-600">{expectedCartAbandonRate}</span>
            </li>
          </ul>
        </div>

        {/* Recommendations Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommendations Summary</h2>
          <p className="text-gray-700 leading-relaxed">{recommendationsSummary}</p>
        </div>

        {/* Go to Results Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/results')}
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-lg"
          >
            Go to Results
          </button>
        </div>
      </div>
    </div>
  )
}
