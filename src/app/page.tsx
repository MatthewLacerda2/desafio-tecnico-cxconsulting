'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setIsValidUrl(false)
      return
    }

    const valid = validateUrl(url)
    setIsValidUrl(valid)

    if (valid) {
      setIsLoading(true)
      // TODO: insert api here
      setTimeout(() => {
        setIsLoading(false)
        router.push(`/report?url=${encodeURIComponent(url)}`)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            CRO Improvements Report
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive conversion rate optimization reports for your e-commerce pages
          </p>
        </div>

        {/* URL Input Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Enter E-commerce URL
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="https://example.com/product-page"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                {isLoading ? 'Generating Report...' : 'Generate Report'}
              </button>
            </form>
            
            {isValidUrl === false && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-center">Please insert a valid URL</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>AI-powered CRO analysis for better conversion rates</p>
        </div>
      </div>
    </div>
  )
}
