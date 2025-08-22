'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Play, Sparkles, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Play intro sound effect (optional)
    if (!audioPlayed) {
      setAudioPlayed(true)
    }

    const timer = setTimeout(() => {
      setShowIntro(false)
      setShowContent(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [audioPlayed])

  const handleGetStarted = () => {
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="mb-8"
              >
                <motion.h1
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                  className="text-9xl font-black bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent tracking-wider"
                  style={{ 
                    textShadow: '0 0 30px rgba(255,255,255,0.3)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  GENESIS
                </motion.h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 1.5 }}
                className="text-center"
              >
                <p className="text-2xl text-gray-300 font-light tracking-wide">
                  The Origin of Your Career Journey
                </p>
                <div className="mt-4 w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>

            <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mb-12"
              >
                <div className="flex items-center justify-center mb-8">
                  <Sparkles className="w-8 h-8 text-white mr-4" />
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Welcome to Genesis
                  </h1>
                  <Sparkles className="w-8 h-8 text-white ml-4" />
                </div>
                
                <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
                  The world's first gamified, AI-powered, community-based career growth platform. 
                  Discover your path, join elite communities, build streaks, compete globally, 
                  and get mentored by industry leaders.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mb-16"
              >
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-white text-black hover:bg-gray-200 text-xl font-semibold px-12 py-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Begin Your Journey
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-gray-700 transition-all duration-300">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Discover Your Path</h3>
                  <p className="text-gray-400 leading-relaxed">
                    AI-powered career recommendations across tech and non-tech domains. 
                    From AI/ML to Medicine, Politics to Film.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-gray-700 transition-all duration-300">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Gamified Growth</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Build streaks, earn XP, unlock badges, and climb global leaderboards. 
                    Make career development addictive.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:border-gray-700 transition-all duration-300">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Elite Mentorship</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Connect with top 10% performers in your field. 
                    Get personalized guidance and accelerate your growth.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
