import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json()

    if (!domains || domains.length === 0) {
      return NextResponse.json({ error: 'No domains provided' }, { status: 400 })
    }

    const domainNames = domains.map((domain: string) => 
      domain.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    ).join(', ')

    const prompt = `Based on the following career domains: ${domainNames}, provide 3-5 specific role recommendations that combine these interests. Focus on emerging roles and interdisciplinary opportunities. Return only the role names, separated by commas.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a career advisor AI that provides specific, actionable role recommendations based on user interests. Focus on modern, in-demand roles that combine multiple domains."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const recommendations = completion.choices[0]?.message?.content
      ?.split(',')
      .map(rec => rec.trim())
      .filter(rec => rec.length > 0) || []

    return NextResponse.json({ recommendations })
  } catch (error: any) {
    console.error('AI recommendation error:', error)
    
    // Fallback recommendations if OpenAI fails
    const fallbackRecommendations = [
      'AI Product Manager',
      'Technical Program Manager',
      'Growth Engineer',
      'Developer Advocate',
      'Solutions Architect'
    ]

    return NextResponse.json({ recommendations: fallbackRecommendations })
  }
}
