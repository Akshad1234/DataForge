import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { userId, domains } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Get or create communities for each domain
    const communityAssignments = []

    for (const domain of domains) {
      // Check if community exists for this domain
      let { data: community } = await supabase
        .from('communities')
        .select('id')
        .eq('domain_slug', domain)
        .single()

      // Create community if it doesn't exist
      if (!community) {
        const communityName = domain.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) + ' Community'
        
        const { data: newCommunity, error: createError } = await supabase
          .from('communities')
          .insert({
            name: communityName,
            domain_slug: domain,
            description: `Connect with professionals and enthusiasts in ${communityName.replace(' Community', '')}`,
          })
          .select('id')
          .single()

        if (createError) {
          console.error('Error creating community:', createError)
          continue
        }

        community = newCommunity
      }

      // Assign user to community
      const { error: assignError } = await supabase
        .from('community_memberships')
        .upsert({
          user_id: userId,
          community_id: community.id,
          role: 'member'
        })

      if (!assignError) {
        communityAssignments.push(community.id)
      }
    }

    return NextResponse.json({ 
      success: true, 
      assignedCommunities: communityAssignments.length 
    })
  } catch (error: any) {
    console.error('Community assignment error:', error)
    return NextResponse.json(
      { error: 'Failed to assign communities' },
      { status: 500 }
    )
  }
}
