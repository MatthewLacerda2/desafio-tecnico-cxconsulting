import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { geminiCROSchema, CROAnalysis } from '@/types/cro'
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

  const html = await response.text()
  
  console.log('HTML content length:', html.length)
  return html
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function scrapeWebpage(url: string): Promise<string> {
  try {
    const html = await fetchConversion(url)
    
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')   // Remove styles
      .replace(/<[^>]+>/g, ' ')                          // Remove HTML tags
      .replace(/\s+/g, ' ')                              // Normalize whitespace
      .trim()
    
    console.log('Cleaned text length:', textContent.length)
    return textContent
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

    let pageContent: string
    try {
      pageContent = await scrapeWebpage(url)
      console.log("PageContent aqui")
      console.log(pageContent)
    } catch (scrapingError) {
      return NextResponse.json(
        { error: 'Failed to access webpage content' },
        { status: 400 }
      )
    }

    try {
      const prompt = `Analyze this e-commerce webpage content and generate a CRO (Conversion Rate Optimization) report:

WEBPAGE CONTENT:
${pageContent.substring(0, 8000)}${pageContent.length > 8000 ? '...' : ''}

Please provide a comprehensive CRO analysis based on the content above. Be succint and to the point.`
      
      const geminiResult = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: geminiCROSchema  // Use the static schema object
        }
      })

      console.log("Resultado aqui")
      console.log(geminiResult)
      
      const croAnalysis = geminiResult.text

      console.log("CroAnalysis aqui")
      console.log(croAnalysis)
      
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