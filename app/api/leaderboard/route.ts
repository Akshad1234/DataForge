import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Mock leaderboard data
    const mockLeaderboard = [
      {
        rank: 1,
        user: {
          id: 'user-1',
          username: 'emma_thompson',
          full_name: 'Emma Thompson',
          avatar_url: '/placeholder.svg?height=32&width=32',
          level: 8,
          xp: 5420,
          streak_count: 45,
          primary_domain: 'Artificial Intelligence'
        }
      },
      {
        rank: 2,
        user: {
          id: 'user-2',
          username: 'david_kim',
          full_name: 'David Kim',
          avatar_url: '/placeholder.svg?height=32&width=32',
          level: 7,
          xp: 4890,
          streak_count: 38,
          primary_domain: 'Software Development'
        }
      },
      {
        rank: 3,
        user: {
          id: 'user-3',
          username: 'lisa_wang',
          full_name: 'Lisa Wang',
          avatar_url: '/placeholder.svg?height=32&width=32',
          level: 7,
          xp: 4650,
          streak_count: 42,
          primary_domain: 'Data Science'
        }
      },
      {
        rank: 4,
        user: {
          id: 'current-user',
          username: 'you',
          full_name: 'You',
          avatar_url: '/placeholder.svg?height=32&width=32',
          level: 3,
          xp: 1250,
          streak_count: 7,
          primary_domain: 'Multiple'
        }
      },
      {
        rank: 5,
        user: {
          id: 'user-5',
          username: 'john_smith',
          full_name: 'John Smith',
          avatar_url: '/placeholder.svg?height=32&width=32',
          level: 2,
          xp: 1180,
          streak_count: 15,
          primary_domain: 'Marketing'
        }
      }
    ]

    // Filter by domain if specified
    const filteredLeaderboard = domain && domain !== 'all'
      ? mockLeaderboard.filter(entry => 
          entry.user.primary_domain.toLowerCase().includes(domain.toLowerCase())
        )
      : mockLeaderboard

    // Apply limit
    const limitedLeaderboard = filteredLeaderboard.slice(0, limit)

    return NextResponse.json({
      leaderboard: limitedLeaderboard,
      total: filteredLeaderboard.length
    })
  } catch (error) {
    console.error('Leaderboard fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
