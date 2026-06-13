import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import TopicInput from './components/TopicInput'
import AgentProgress from './components/AgentProgress'
import ArticleResult from './components/ArticleResult'
import HowItWorks from './components/HowItWorks'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState([
    { step: 'planning', status: 'pending', message: 'Plan & Research' },
    { step: 'writing', status: 'pending', message: 'Write Article' },
    { step: 'editing', status: 'pending', message: 'Edit & Polish' },
  ])
  const [article, setArticle] = useState(null)
  const [provider, setProvider] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = useCallback(async (inputTopic) => {
    setTopic(inputTopic)
    setIsGenerating(true)
    setError(null)
    setArticle(null)
    setProvider(null)
    setProgress([
      { step: 'planning', status: 'pending', message: 'Plan & Research' },
      { step: 'writing', status: 'pending', message: 'Write Article' },
      { step: 'editing', status: 'pending', message: 'Edit & Polish' },
    ])

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: inputTopic }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))

              if (event.step === 'done') {
                const payload = JSON.parse(event.message)
                setArticle(payload.article)
                setProvider(payload.provider)
                setIsGenerating(false)
              } else if (event.step === 'planning') {
                setProgress((prev) =>
                  prev.map((p) =>
                    p.step === 'planning'
                      ? { ...p, status: event.status, message: event.message }
                      : p
                  )
                )
                if (event.status === 'completed') {
                  setProgress((prev) =>
                    prev.map((p) =>
                      p.step === 'writing'
                        ? { ...p, status: 'running', message: 'Writing in progress...' }
                        : p
                    )
                  )
                }
              } else if (event.step === 'writing') {
                setProgress((prev) =>
                  prev.map((p) =>
                    p.step === 'writing'
                      ? { ...p, status: event.status, message: event.message }
                      : p
                  )
                )
                if (event.status === 'completed') {
                  setProgress((prev) =>
                    prev.map((p) =>
                      p.step === 'editing'
                        ? { ...p, status: 'running', message: 'Editing in progress...' }
                        : p
                    )
                  )
                }
              } else if (event.step === 'editing') {
                setProgress((prev) =>
                  prev.map((p) =>
                    p.step === 'editing'
                      ? { ...p, status: event.status, message: event.message }
                      : p
                  )
                )
              }

              if (event.status === 'error') {
                throw new Error(event.message)
              }
            } catch (parseErr) {
              if (parseErr.message && !parseErr.message.includes('JSON')) {
                throw parseErr
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err.message)
      setIsGenerating(false)
    }
  }, [])

  const handleReset = () => {
    setArticle(null)
    setTopic('')
    setProvider(null)
    setError(null)
    setProgress([
      { step: 'planning', status: 'pending', message: 'Plan & Research' },
      { step: 'writing', status: 'pending', message: 'Write Article' },
      { step: 'editing', status: 'pending', message: 'Edit & Polish' },
    ])
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <Hero />

      <main className="max-w-4xl mx-auto px-4 pb-24 space-y-16">
        {/* Input Section */}
        <section id="demo">
          <TopicInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </section>

        {/* Progress / Result Section */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AgentProgress steps={progress} topic={topic} />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glow-card border-red-500/30 p-8 text-center"
            >
              <p className="text-red-400 text-lg mb-4">⚠️ {error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {article && !isGenerating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ArticleResult
                article={article}
                topic={topic}
                provider={provider}
                onRegenerate={() => handleGenerate(topic)}
                onNewTopic={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* How It Works (always visible, below the action) */}
        <HowItWorks />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        Built with FastAPI + crewAI + React • Portfolio Demo
      </footer>
    </div>
  )
}
