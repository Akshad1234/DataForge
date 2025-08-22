import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const community = searchParams.get('community')

    // Mock feed data
    const mockPosts = [
      {
        id: '1',
        author: {
          id: 'user-1',
          username: 'sarah_chen',
          full_name: 'Sarah Chen',
          avatar_url: '/placeholder.svg?height=40&width=40',
          badges: ['ML Expert', 'Top Contributor']
        },
        community: {
          id: 'ai-community',
          name: 'AI Community',
          domain: 'Artificial Intelligence'
        },
        content: 'Just completed my first machine learning project! Built a recommendation system using collaborative filtering. The results were amazing - 85% accuracy! 🚀',
        post_type: 'project',
        likes_count: 24,
        comments_count: 8,
        bookmarks_count: 5,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        user_interactions: {
          liked: false,
          bookmarked: false
        }
      },
      {
        id: '2',
        author: {
          id: 'user-2',
          username: 'alex_rodriguez',
          full_name: 'Alex Rodriguez',
          avatar_url: '/placeholder.svg?height=40&width=40',
          badges: ['Security Guru', 'Mentor']
        },
        community: {
          id: 'cybersecurity-community',
          name: 'Cybersecurity Community',
          domain: 'Cybersecurity'
        },
        content: 'Sharing my latest penetration testing methodology. Found 3 critical vulnerabilities in a client\'s system. Always remember: security is not a feature, it\'s a foundation! 🔒',
        post_type: 'text',
        likes_count: 31,
        comments_count: 12,
        bookmarks_count: 8,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        user_interactions: {
          liked: true,
          bookmarked: false
        }
      },
      {
        id: '3',
        author: {
          id: 'user-3',
          username: 'maya_patel',
          full_name: 'Maya Patel',
          avatar_url: '/placeholder.svg?height=40&width=40',
          badges: ['Design Master', 'UX Champion']
        },
        community: {
          id: 'design-community',
          name: 'Design Community',
          domain: 'Design'
        },
        content: 'New UI design for a fintech app! Focused on accessibility and user experience. The client loved the clean, modern approach. Design is not just how it looks, but how it works! ✨',
        post_type: 'project',
        likes_count: 18,
        comments_count: 5,
        bookmarks_count: 12,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        user_interactions: {
          liked: false,
          bookmarked: true
        }
      }
    ]

    // Filter by community if specified
    const filteredPosts = community 
      ? mockPosts.filter(post => post.community.id === community)
      : mockPosts

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit),
        hasNext: endIndex < filteredPosts.length,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Feed fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    )
  }
}
