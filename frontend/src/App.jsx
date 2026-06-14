import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBrowserLanguage, usePreferences } from './hooks/useBrowserLanguage'
import { t, tf, SUPPORTED_UI_LANGUAGES } from './i18n'
import Hero from './components/Hero'
import TopicInput from './components/TopicInput'
import AgentProgress from './components/AgentProgress'
import ArticleResult from './components/ArticleResult'
import HowItWorks from './components/HowItWorks'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function App() {
  // UI language (browser-detected, user-overridable)
  const { uiLanguage, changeLanguage } = useBrowserLanguage()

  // Content customization (persisted in localStorage)
  const { preferences, updatePreference } = usePreferences()

  // Generation state
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState([
    { step: 'planning', status: 'pending', message: '' },
    { step: 'writing', status: 'pending', message: '' },
    { step: 'editing', status: 'pending', message: '' },
  ])
  const [article, setArticle] = useState(null)
  const [provider, setProvider] = useState(null)
  const [usedConfig, setUsedConfig] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = useCallback(async (inputTopic) => {
    setTopic(inputTopic)
    setIsGenerating(true)
    setError(null)
    setArticle(null)
    setProvider(null)
    setUsedConfig(null)
    setProgress([
      { step: 'planning', status: 'running', message: 'Researching...' },
      { step: 'writing', status: 'running', message: 'Writing...' },
      { step: 'editing', status: 'running', message: 'Polishing...' },
    ])

    // Snapshot the preferences at generation time
    const config = { ...preferences }

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: inputTopic,
          content_language: config.contentLanguage,
          tone: config.tone,
          length: config.length,
          perspective: config.perspective,
        }),
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
                setUsedConfig({
                  contentLanguage: payload.content_language,
                  languageName: payload.language_name,
                  tone: payload.tone,
                  length: payload.length,
                  perspective: payload.perspective,
                })
                setProgress((prev) =>
                  prev.map((p) => ({ ...p, status: 'completed' }))
                )
                setIsGenerating(false)
              } else if (event.step === 'error') {
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
  }, [preferences])

  const handleReset = () => {
    setArticle(null)
    setTopic('')
    setProvider(null)
    setError(null)
    setUsedConfig(null)
    setProgress([
      { step: 'planning', status: 'pending', message: '' },
      { step: 'writing', status: 'pending', message: '' },
      { step: 'editing', status: 'pending', message: '' },
    ])
    // Scroll back to input
    setTimeout(() => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Language Switcher — clean pill button, top-right */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <select
            value={uiLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="appearance-none bg-gray-900/70 border border-gray-700/50 rounded-full pl-3.5 pr-8 py-1.5 text-xs text-gray-300 hover:border-gray-600 focus:outline-none focus:border-brand-500 cursor-pointer backdrop-blur-sm transition-colors"
          >
            {SUPPORTED_UI_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.flag} {lang.code.toUpperCase()}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Hero */}
      <Hero uiLang={uiLanguage} />

      <main className="max-w-4xl mx-auto px-4 pb-24 space-y-16">
        {/* Input Section */}
        <section id="demo">
          <TopicInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            contentLanguage={preferences.contentLanguage}
            tone={preferences.tone}
            length={preferences.length}
            perspective={preferences.perspective}
            onContentLanguageChange={(v) => updatePreference('contentLanguage', v)}
            onToneChange={(v) => updatePreference('tone', v)}
            onLengthChange={(v) => updatePreference('length', v)}
            onPerspectiveChange={(v) => updatePreference('perspective', v)}
            uiLang={uiLanguage}
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
              <AgentProgress steps={progress} topic={topic} uiLang={uiLanguage} />
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
                {t('error.tryAgain', uiLanguage)}
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
                usedConfig={usedConfig}
                onRegenerate={() => handleGenerate(topic)}
                onNewTopic={handleReset}
                uiLang={uiLanguage}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* How It Works */}
        <HowItWorks uiLang={uiLanguage} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        {t('footer', uiLanguage)}
      </footer>
    </div>
  )
}
