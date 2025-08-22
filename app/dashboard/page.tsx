'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Trophy, Flame, Users, TrendingUp, Star, MessageCircle, Heart, Bookmark, Target, Award, Zap, Bell, Settings, Search, Plus, BarChart3, Calendar, BookOpen, Lightbulb } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  level: number
  xp: number
  streak_count: number
  global_rank: number
  selected_domains: string[]
  badges: Array<{
    id: string
    name: string
    icon: string
    rarity: string
  }>
}

interface CommunityPost {
  id: string
  author: {
    full_name: string
    avatar_url?: string
    badges: string[]
  }
  community: string
  content: string
  likes_count: number
  comments_count: number
  created_at: string
  user_liked: boolean
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('feed')
  
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Check authentication
      const userData = localStorage.getItem('genesis-user-profile')
      
      if (!userData) {
        const basicUserData = localStorage.getItem('genesis-user')
        if (!basicUserData) {
          router.push('/auth')
          return
        }
        
        // User hasn't completed onboarding
        router.push('/onboarding')
        return
      }

      const profile = JSON.parse(userData)
      setUserProfile(profile)

      // Load mock community posts
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          author: {
            full_name: 'Sarah Chen',
            avatar_url: '/placeholder.svg?height=40&width=40',
            badges: ['ML Expert', 'Top Contributor']
          },
          community: 'AI/ML Community',
          content: 'Just completed my first machine learning project using TensorFlow! Built a recommendation system that achieved 87% accuracy. The journey from data preprocessing to model deployment was incredible. Key learnings: feature engineering is crucial, and proper validation prevents overfitting. Next up: exploring transformer architectures! 🤖✨',
          likes_count: 24,
          comments_count: 8,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user_liked: false
        },
        {
          id: '2',
          author: {
            full_name: 'Alex Rodriguez',
            avatar_url: '/placeholder.svg?height=40&width=40',
            badges: ['Security Guru', 'Mentor']
          },
          community: 'Cybersecurity Community',
          content: 'Sharing insights from my recent penetration testing engagement. Discovered a critical SQL injection vulnerability that could have exposed sensitive customer data. This reinforces why security should be built into the development process from day one, not added as an afterthought. Remember: security is everyone\'s responsibility! 🔒',
          likes_count: 31,
          comments_count: 12,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user_liked: true
        },
        {
          id: '3',
          author: {
            full_name: 'Maya Patel',
            avatar_url: '/placeholder.svg?height=40&width=40',
            badges: ['Design Master', 'UX Champion']
          },
          community: 'UI/UX Design Community',
          content: 'Excited to share my latest UI design for a fintech mobile app! Focused heavily on accessibility and inclusive design principles. Used high contrast ratios, clear typography, and intuitive navigation patterns. The client was thrilled with the user testing results - 95% task completion rate! Design is not just about aesthetics, it\'s about creating meaningful experiences. 🎨📱',
          likes_count: 18,
          comments_count: 5,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user_liked: false
        }
      ]

      setCommunityPosts(mockPosts)

      // Load mock leaderboard
      const mockLeaderboard = [
        { rank: 1, id: '1', full_name: 'Emma Thompson', level: 8, xp: 5420, streak_count: 45 },
        { rank: 2, id: '2', full_name: 'David Kim', level: 7, xp: 4890, streak_count: 38 },
        { rank: 3, id: '3', full_name: 'Lisa Wang', level: 7, xp: 4650, streak_count: 42 },
        { rank: profile.global_rank, id: profile.id, full_name: 'You', level: profile.level, xp: profile.xp, streak_count: profile.streak_count },
        { rank: 5, id: '5', full_name: 'John Smith', level: 2, xp: 1180, streak_count: 15 },
      ].sort((a, b) => b.xp - a.xp).map((user, index) => ({ ...user, rank: index + 1 }))

      setLeaderboard(mockLeaderboard)

    } catch (error: any) {
      toast.error('Failed to load dashboard data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    setCommunityPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              user_liked: !post.user_liked,
              likes_count: post.user_liked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      )
    )
    toast.success(communityPosts.find(p => p.id === postId)?.user_liked ? 'Post unliked' : 'Post liked!')
  }

  const handleLogout = async () => {
    localStorage.removeItem('genesis-user')
    localStorage.removeItem('genesis-user-profile')
    toast.success('Logged out successfully')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your Genesis dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-gray-400 mb-6">Finish onboarding to access your dashboard</p>
          <Button onClick={() => router.push('/onboarding')}>
            Complete Onboarding
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                GENESIS
              </h1>
              
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'feed' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Feed
                </button>
                <button
                  onClick={() => setActiveTab('communities')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'communities' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Communities
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'leaderboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Leaderboard
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-orange-500/20 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-orange-500">{userProfile.streak_count}</span>
                </div>
                
                <Avatar className="cursor-pointer" onClick={handleLogout}>
                  <AvatarImage src={userProfile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {userProfile.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={userProfile.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl bg-gray-700">
                      {userProfile.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-white">{userProfile.full_name}</h2>
                  <p className="text-gray-400 text-sm">Level {userProfile.level} • #{userProfile.global_rank} Global</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress to Level {userProfile.level + 1}</span>
                      <span className="text-gray-400">{userProfile.xp % 1000}/1000 XP</span>
                    </div>
                    <Progress value={(userProfile.xp % 1000) / 10} className="h-2 bg-gray-800" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">{userProfile.streak_count}</div>
                      <div className="text-xs text-gray-400">Day Streak</div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">{userProfile.xp}</div>
                      <div className="text-xs text-gray-400">Total XP</div>
                    </div>
                  </div>

                  <Separator className="bg-gray-800" />

                  <div>
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Badges
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.badges?.map((badge) => (
                        <Badge key={badge.id} className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border-purple-600/30">
                          {badge.icon} {badge.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-800" />

                  <div>
                    <h3 className="font-semibold text-white mb-3">Career Domains</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.selected_domains?.map((domain) => (
                        <Badge key={domain} variant="outline" className="border-gray-600 text-gray-300">
                          {domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-gray-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-gray-700">
                  <Target className="w-4 h-4 mr-2" />
                  Set Daily Goal
                </Button>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  Find Mentors
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Lightbulb className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Welcome back, {userProfile.full_name.split(' ')[0]}! 🚀
                    </h3>
                    <p className="text-gray-300 mb-4">
                      You're on a {userProfile.streak_count}-day streak! Keep the momentum going by engaging with your communities and sharing your progress.
                    </p>
                    <div className="flex space-x-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <BookOpen className="w-4 h-4 mr-2" />
                        AI Recommendations
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Community Feed
                </h2>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>

              {communityPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-gray-700 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={post.author.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-700">
                            {post.author.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white">{post.author.full_name}</h3>
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                              {post.community}
                            </Badge>
                            {post.author.badges.map((badge) => (
                              <Badge key={badge} className="text-xs bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300">
                                {badge}
                              </Badge>
                            ))}
                            <span className="text-xs text-gray-500">
                              • {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                          <div className="flex items-center space-x-6">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center space-x-2 transition-colors ${
                                post.user_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${post.user_liked ? 'fill-current' : ''}`} />
                              <span className="text-sm">{post.likes_count}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{post.comments_count}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Leaderboard */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Global Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        user.full_name === 'You' ? 'bg-blue-900/20 border border-blue-800/30' : 'hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-black' :
                          user.rank === 2 ? 'bg-gray-400 text-black' :
                          user.rank === 3 ? 'bg-orange-500 text-black' :
                          'bg-gray-600 text-white'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">
                            {user.full_name}
                          </div>
                          <div className="text-xs text-gray-400">Level {user.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{user.xp} XP</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Flame className="w-3 h-3 mr-1 text-orange-500" />
                          {user.streak_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-purple-900/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-300 mb-2">Next Level Goal</h4>
                    <p className="text-sm text-gray-300">
                      Complete 3 more projects and engage with 5 community posts to reach Level {userProfile.level + 1}!
                    </p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">Skill Recommendation</h4>
                    <p className="text-sm text-gray-300">
                      Based on your domains, consider learning React Native for mobile development.
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Full AI Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-green-900/20 p-3 rounded-lg border border-green-800/30">
                    <h4 className="font-semibold text-green-300 text-sm">AI/ML Hackathon</h4>
                    <p className="text-xs text-gray-400 mt-1">Tomorrow, 9:00 AM</p>
                  </div>
                  <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/30">
                    <h4 className="font-semibold text-blue-300 text-sm">Design Workshop</h4>
                    <p className="text-xs text-gray-400 mt-1">Friday, 2:00 PM</p>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
                    <h4 className="font-semibold text-purple-300 text-sm">Career Mentorship Session</h4>
                    <p className="text-xs text-gray-400 mt-1">Next Monday, 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
