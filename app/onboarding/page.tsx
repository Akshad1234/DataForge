'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, ChevronLeft, Sparkles, Github, Linkedin, Twitter, Instagram, Youtube, Globe, Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const careerDomains = [
  { id: 'ai-ml', name: 'AI/Machine Learning', icon: '🤖', subdomains: ['ML Engineer', 'AI Researcher', 'Prompt Engineer', 'Data Scientist'] },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒', subdomains: ['Security Analyst', 'Penetration Tester', 'CISO', 'Ethical Hacker'] },
  { id: 'ui-ux', name: 'UI/UX Design', icon: '🎨', subdomains: ['UI Designer', 'UX Researcher', 'Product Designer', 'Design Systems'] },
  { id: 'development', name: 'Software Development', icon: '💻', subdomains: ['Frontend Developer', 'Backend Developer', 'Full Stack', 'DevOps Engineer'] },
  { id: 'marketing', name: 'Digital Marketing', icon: '📈', subdomains: ['Growth Marketer', 'Content Creator', 'SEO Specialist', 'Social Media Manager'] },
  { id: 'law', name: 'Law & Legal', icon: '⚖️', subdomains: ['Corporate Lawyer', 'Legal Tech', 'Compliance Officer', 'Patent Attorney'] },
  { id: 'medicine', name: 'Medicine & Healthcare', icon: '🏥', subdomains: ['Doctor', 'Medical Researcher', 'Healthcare Tech', 'Biotech'] },
  { id: 'politics', name: 'Politics & Policy', icon: '🏛️', subdomains: ['Policy Analyst', 'Campaign Manager', 'Public Affairs', 'Diplomat'] },
  { id: 'film', name: 'Film & Media', icon: '🎬', subdomains: ['Director', 'Producer', 'Cinematographer', 'Editor'] },
  { id: 'music', name: 'Music & Audio', icon: '🎵', subdomains: ['Music Producer', 'Sound Engineer', 'Composer', 'Audio Designer'] },
  { id: 'business', name: 'Business & Finance', icon: '💼', subdomains: ['Product Manager', 'Business Analyst', 'Investment Banking', 'Consulting'] },
  { id: 'teaching', name: 'Education & Teaching', icon: '📚', subdomains: ['Teacher', 'Educational Tech', 'Curriculum Designer', 'Academic Research'] },
  { id: 'agriculture', name: 'Agriculture & Sustainability', icon: '🌱', subdomains: ['Agricultural Engineer', 'Sustainability Consultant', 'Food Tech', 'Environmental Scientist'] },
]

const socialPlatforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, placeholder: 'your-profile', priority: { 'business': 1, 'law': 1, 'medicine': 1, 'politics': 1 } },
  { id: 'github', name: 'GitHub', icon: Github, placeholder: 'username', priority: { 'development': 1, 'ai-ml': 1, 'cybersecurity': 2 } },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, placeholder: 'username', priority: { 'marketing': 1, 'politics': 1, 'ai-ml': 2 } },
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'username', priority: { 'ui-ux': 1, 'marketing': 2, 'film': 2 } },
  { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'channel', priority: { 'film': 1, 'music': 1, 'teaching': 2 } },
  { id: 'behance', name: 'Behance', icon: Globe, placeholder: 'username', priority: { 'ui-ux': 1, 'film': 2 } },
  { id: 'medium', name: 'Medium', icon: Globe, placeholder: '@username', priority: { 'teaching': 1, 'ai-ml': 3 } },
  { id: 'kaggle', name: 'Kaggle', icon: Globe, placeholder: 'username', priority: { 'ai-ml': 1, 'development': 3 } },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [socialHandles, setSocialHandles] = useState<Record<string, string>>({})
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('genesis-user')
    if (!userData) {
      router.push('/auth')
    }
  }, [router])

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains(prev => {
      const newSelection = prev.includes(domainId) 
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
      
      // Generate AI recommendations when domains change
      if (newSelection.length > 0) {
        generateAIRecommendations(newSelection)
      }
      
      return newSelection
    })
  }

  const generateAIRecommendations = async (domains: string[]) => {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domains })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Failed to get AI recommendations:', error)
      // Fallback recommendations
      setAiRecommendations([
        'AI Product Manager',
        'Technical Program Manager', 
        'Growth Engineer',
        'Developer Advocate'
      ])
    }
  }

  const handleSocialHandleChange = (platform: string, handle: string) => {
    setSocialHandles(prev => ({ ...prev, [platform]: handle }))
  }

  const getSortedSocialPlatforms = () => {
    return socialPlatforms.sort((a, b) => {
      const aPriority = Math.min(...selectedDomains.map(domain => a.priority[domain] || 10))
      const bPriority = Math.min(...selectedDomains.map(domain => b.priority[domain] || 10))
      return aPriority - bPriority
    })
  }

  const handleComplete = async () => {
    setLoading(true)
    
    try {
      const userData = localStorage.getItem('genesis-user')
      if (!userData) {
        toast.error('Please sign in first')
        router.push('/auth')
        return
      }

      const user = JSON.parse(userData)

      // Save onboarding data to localStorage (demo mode)
      const profileData = {
        ...user,
        selected_domains: selectedDomains,
        social_handles: socialHandles,
        onboarding_completed: true,
        level: 1,
        xp: 100, // Starting XP
        streak_count: 1,
        global_rank: Math.floor(Math.random() * 1000) + 100,
        badges: [
          { id: 'early-adopter', name: 'Early Adopter', icon: '🚀', rarity: 'rare' },
          { id: 'first-steps', name: 'First Steps', icon: '👣', rarity: 'common' }
        ],
        updated_at: new Date().toISOString()
      }

      localStorage.setItem('genesis-user-profile', JSON.stringify(profileData))

      toast.success('Welcome to Genesis! Your journey begins now.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              GENESIS
            </h1>
            <p className="text-gray-400">Complete your profile to unlock your potential</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {step} of 2</span>
              <span className="text-sm text-gray-400">{Math.round((step / 2) * 100)}% Complete</span>
            </div>
            <Progress value={(step / 2) * 100} className="h-2 bg-gray-800" />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
                      <Briefcase className="w-6 h-6 mr-3" />
                      Which career paths interest you?
                    </CardTitle>
                    <p className="text-gray-400 mt-2">Select all domains that spark your curiosity</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {careerDomains.map((domain) => (
                        <motion.div
                          key={domain.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 ${
                              selectedDomains.includes(domain.id)
                                ? 'bg-white/10 border-white/30 shadow-lg'
                                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => handleDomainToggle(domain.id)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="text-3xl mb-2">{domain.icon}</div>
                              <h3 className="font-semibold text-white mb-2 text-sm">{domain.name}</h3>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {domain.subdomains.slice(0, 2).map((sub) => (
                                  <Badge key={sub} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {aiRecommendations.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-4 mb-6"
                      >
                        <div className="flex items-center mb-2">
                          <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
                          <span className="font-semibold text-blue-400">AI Career Recommendations</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {aiRecommendations.map((rec, index) => (
                            <Badge key={index} className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        disabled={selectedDomains.length === 0}
                        className="bg-white text-black hover:bg-gray-200 font-medium"
                      >
                        Continue <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
                      <Globe className="w-6 h-6 mr-3" />
                      Connect Your Professional Profiles
                    </CardTitle>
                    <p className="text-gray-400 mt-2">Link your social profiles to showcase your work and connect with others</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {getSortedSocialPlatforms().map((platform) => {
                        const Icon = platform.icon
                        const isPriority = selectedDomains.some(domain => 
                          platform.priority[domain] && platform.priority[domain] <= 2
                        )
                        
                        return (
                          <div key={platform.id} className={`flex items-center space-x-4 p-3 rounded-lg ${
                            isPriority ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gray-800/30'
                          }`}>
                            <div className="flex items-center space-x-3 w-36">
                              <Icon className="w-5 h-5 text-gray-400" />
                              <span className="font-medium text-white">{platform.name}</span>
                              {isPriority && (
                                <Badge className="bg-blue-600/20 text-blue-300 text-xs">Recommended</Badge>
                              )}
                            </div>
                            <Input
                              placeholder={platform.placeholder}
                              value={socialHandles[platform.id] || ''}
                              onChange={(e) => handleSocialHandleChange(platform.id, e.target.value)}
                              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                            />
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-400 mb-2">
                        <strong className="text-white">Pro Tip:</strong> Adding your professional profiles helps us:
                      </p>
                      <ul className="text-sm text-gray-400 space-y-1 ml-4">
                        <li>• Analyze your current skills and projects</li>
                        <li>• Provide personalized AI recommendations</li>
                        <li>• Connect you with relevant mentors and peers</li>
                        <li>• Track your professional growth over time</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button
                        onClick={handleComplete}
                        disabled={loading}
                        className="bg-white text-black hover:bg-gray-200 font-medium"
                      >
                        {loading ? 'Setting up...' : 'Complete Setup'}
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
