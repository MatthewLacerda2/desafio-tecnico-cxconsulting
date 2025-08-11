import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Example: Fetch users from a 'users' table
    // You can modify this based on your actual table structure
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(100)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ users: data })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()
    
    // Example: Insert a new user
    // You can modify this based on your actual table structure
    const { data, error } = await supabase
      .from('users')
      .insert([body])
      .select()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ user: data[0] }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
