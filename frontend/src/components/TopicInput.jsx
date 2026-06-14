import { useState } from 'react'
import { motion } from 'framer-motion'
import { t } from '../i18n'
import CustomizationPanel from './CustomizationPanel'

const PLACEHOLDERS = [
  'Artificial Intelligence in Healthcare',
  'The Future of Remote Work',
  'Climate Change and Renewable Energy',
  'How Quantum Computing Works',
  'The Rise of Electric Vehicles',
]

export default function TopicInput({
  onGenerate,
  isGenerating,
  contentLanguage,
  tone,
  length,
  perspective,
  onContentLanguageChange,
  onToneChange,
  onLengthChange,
  onPerspectiveChange,
  uiLang,
}) {
  const [topic, setTopic] = useState('')
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = topic.trim()
    if (trimmed.length >= 3 && !isGenerating) {
      onGenerate(trimmed)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glow-card p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <label className="block text-sm font-medium text-gray-400 mb-3">
        {t('input.label', uiLang)}
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={placeholder}
          disabled={isGenerating}
          className="flex-1 px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors disabled:opacity-50"
          minLength={3}
          maxLength={300}
          autoFocus
        />
        <button
          type="submit"
          disabled={topic.trim().length < 3 || isGenerating}
          className="px-8 py-4 bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed shadow-lg shadow-brand-600/20"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('input.generating', uiLang)}
            </span>
          ) : (
            t('input.generate', uiLang)
          )}
        </button>
      </div>

      {/* Customization Panel */}
      <CustomizationPanel
        contentLanguage={contentLanguage}
        tone={tone}
        length={length}
        perspective={perspective}
        onContentLanguageChange={onContentLanguageChange}
        onToneChange={onToneChange}
        onLengthChange={onLengthChange}
        onPerspectiveChange={onPerspectiveChange}
        isGenerating={isGenerating}
        uiLang={uiLang}
      />

      <p className="mt-3 text-xs text-gray-600">
        {t('input.footer', uiLang)}
      </p>
    </motion.form>
  )
}
