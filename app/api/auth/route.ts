import { NextRequest, NextResponse } from 'next/server'

// Mock authentication endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()

    // Mock authentication logic
    if (action === 'signup') {
      // In a real app, you would create a user in Supabase
      return NextResponse.json({
        success: true,
        user: {
          id: 'mock-user-id',
          email,
          username: email.split('@')[0],
          full_name: 'New User'
        },
        token: 'mock-jwt-token'
      })
    }

    if (action === 'login') {
      // Mock login validation
      if (email && password) {
        return NextResponse.json({
          success: true,
          user: {
            id: 'mock-user-id',
            email,
            username: email.split('@')[0],
            full_name: 'Existing User'
          },
          token: 'mock-jwt-token'
        })
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
