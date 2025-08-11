import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { geminiCROSchema } from '@/types/cro'
import { type DoclingDocument } from '@docling/docling-core';

async function fetchConversion(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = (await response.json()) as DoclingDocument;

  console.log(result)
  return result
}

// Initialize Google AI with your API key
const genAI = new GoogleGenAI({})

async function scrapeWebpage(url: string): Promise<string> {
  try {
    return (await fetchConversion(url)).texts?.[0]?.text as string
  } catch (error) {
    console.error('Scraping error:', error)
    throw new Error('Failed to scrape webpage')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      )
    }

    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // 2. Scrape the webpage using Docling
    let pageContent: string
    try {
      pageContent = await scrapeWebpage(url)
    } catch (scrapingError) {
      return NextResponse.json(
        { error: 'Failed to access webpage content' },
        { status: 400 }
      )
    }

    // 3. Send content to Google Gemini
    try {
      const prompt = `Analyze this e-commerce webpage content and generate a CRO (Conversion Rate Optimization) report:

WEBPAGE CONTENT:
${pageContent.substring(0, 8000)}${pageContent.length > 8000 ? '...' : ''}

Please provide a comprehensive CRO analysis based on the content above.`
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: geminiCROSchema
        }
      })
      
      const croAnalysis = result.text
      
      // TODO: Store results in Supabase
      // TODO: Return analysis results
      
      return NextResponse.json({ 
        message: 'Analysis completed',
        url: url,
        analysis: croAnalysis
      })

    } catch (aiError) {
      console.error('AI analysis error:', aiError)
      return NextResponse.json(
        { error: 'Failed to analyze webpage content with AI' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('General error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}