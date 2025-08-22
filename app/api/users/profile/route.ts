import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock user profile data
    const mockProfile = {
      id: 'user-123',
      username: 'john_doe',
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      avatar_url: '/placeholder.svg?height=80&width=80',
      bio: 'Passionate about technology and continuous learning',
      level: 5,
      xp: 2750,
      streak_count: 12,
      global_rank: 156,
      domains: [
        { id: 'ai', name: 'Artificial Intelligence', slug: 'ai' },
        { id: 'software', name: 'Software Development', slug: 'software' }
      ],
      badges: [
        { id: 'early-adopter', name: 'Early Adopter', icon: '🚀', rarity: 'rare' },
        { id: 'streak-master', name: 'Streak Master', icon: '🔥', rarity: 'common' },
        { id: 'community-helper', name: 'Community Helper', icon: '🤝', rarity: 'common' }
      ],
      social_handles: [
        { platform: 'github', handle: 'johndoe', url: 'https://github.com/johndoe' },
        { platform: 'linkedin', handle: 'john-doe', url: 'https://linkedin.com/in/john-doe' }
      ]
    }

    return NextResponse.json(mockProfile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    
    // Mock profile update
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...updates,
        updated_at: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
