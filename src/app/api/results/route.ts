import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || ''
    
    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('reports')
      .select('*')
      .order('date_generated', { ascending: false })
    
    // Apply filter if provided
    if (filter.trim()) {
      query = query.or(`full_url.ilike.%${filter}%,pageSummary.ilike.%${filter}%,improvementsSummary.ilike.%${filter}%`)
    }
    
    const { data: results, error } = await query
    
    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }
    
    // Transform the data to match the frontend interface
    const transformedResults = results?.map(result => ({
      rootUrl: new URL(result.full_url).hostname,
      url: result.full_url,
      dateGenerated: result.date_generated,
      summary: result.improvementsSummary,
      improvementsSummary: result.improvementsSummary
    })) || []

    return NextResponse.json({ 
      message: 'Results retrieved successfully',
      filter: filter,
      results: transformedResults
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
