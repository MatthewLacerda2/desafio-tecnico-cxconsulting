'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CROAnalysis } from '@/types/cro'

export default function ReportPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url') || 'Unknown URL'
  
  const [pageSummary, setPageSummary] = useState<string>('')
  const [recommendedImprovements, setRecommendedImprovements] = useState<string[]>([])
  const [improvementsSummary, setImprovementsSummary] = useState<string>('')
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

        setPageSummary(analysis.pageSummary)
        setRecommendedImprovements(analysis.recommendedImprovements)
        setImprovementsSummary(analysis.improvementsSummary)

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

        {/* Page Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{pageSummary}</p>
          </div>
        </div>

        {/* Recommended Improvements */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Improvements</h2>
          <div className="space-y-3">
            {recommendedImprovements.map((improvement, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700">{improvement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Improvements Summary</h2>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-gray-700">{improvementsSummary}</p>
          </div>
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
