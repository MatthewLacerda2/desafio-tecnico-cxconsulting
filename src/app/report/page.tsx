'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { CROAnalysis } from '@/types/cro'

function ReportContent() {
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
        
        // The analysis is already a parsed object, no need to parse again
        let analysis: CROAnalysis
        try {
          // Remove the JSON.parse since data.analysis is already an object
          analysis = data.analysis
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Analyzing webpage...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <p className="font-semibold text-lg">Analysis Failed</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-200"
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
            CRO Report
          </h1>
          <p className="text-xl text-slate-600 break-all">
            {url}
          </p>
        </div>

        {/* Page Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
          <h2 className="text-3xl font-semibold text-slate-800 mb-6">Page Summary</h2>
          <div className="bg-slate-50 p-6 rounded-xl">
            <p className="text-slate-700 leading-relaxed">{pageSummary}</p>
          </div>
        </div>

        {/* Recommended Improvements */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
          <h2 className="text-3xl font-semibold text-slate-800 mb-6">Recommended Improvements</h2>
          <div className="space-y-4">
            {recommendedImprovements.map((improvement, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                <p className="text-slate-700 leading-relaxed">{improvement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
          <h2 className="text-3xl font-semibold text-slate-800 mb-6">Improvements Summary</h2>
          <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
            <p className="text-slate-700 leading-relaxed">{improvementsSummary}</p>
          </div>
        </div>

        {/* Go to Results Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/results')}
            className="px-10 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:ring-offset-2 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go to Results
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading report...</p>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  )
}
