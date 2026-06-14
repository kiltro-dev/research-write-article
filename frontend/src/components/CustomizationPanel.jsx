import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, tf, CONTENT_LANGUAGES, TONE_OPTIONS, LENGTH_OPTIONS, PERSPECTIVE_OPTIONS } from '../i18n'

/**
 * A single segmented-button group for selecting an option.
 * Renders as a row of pill-shaped buttons — all options visible at a glance.
 */
function SegmentedControl({ label, options, value, onChange, uiLang }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 scale-105'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700/50'
              }`}
            >
              {opt[`label_${uiLang}`] || opt.label_en}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Language selector — dropdown with globe icon and native language names.
 * No flags (per UX best practice — flags represent countries, not languages).
 */
function LanguageSelector({ label, value, onChange, uiLang }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {/* Globe icon — left prefix */}
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors cursor-pointer"
        >
          {CONTENT_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        {/* Chevron — right side only */}
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact summary line shown when the panel is collapsed.
 * Example: "🇪🇸 Español · Casual · Medio · Informativo"
 */
function ConfigSummary({ contentLanguage, tone, length, perspective, uiLang }) {
  const toneLabel = TONE_OPTIONS.find((o) => o.value === tone)?.[`label_${uiLang}`] || tone
  const lengthLabel = LENGTH_OPTIONS.find((o) => o.value === length)?.[`label_${uiLang}`] || length
  const perspLabel = PERSPECTIVE_OPTIONS.find((o) => o.value === perspective)?.[`label_${uiLang}`] || perspective
  const langName = CONTENT_LANGUAGES.find((l) => l.code === contentLanguage)?.name || contentLanguage

  return (
    <span className="text-sm text-gray-500">
      {langName} · {toneLabel} · {lengthLabel} · {perspLabel}
    </span>
  )
}

export default function CustomizationPanel({
  contentLanguage,
  tone,
  length,
  perspective,
  onContentLanguageChange,
  onToneChange,
  onLengthChange,
  onPerspectiveChange,
  isGenerating,
  uiLang,
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Auto-close when generation starts
  useEffect(() => {
    if (isGenerating) setIsOpen(false)
  }, [isGenerating])

  return (
    <div className="mt-4">
      {/* Trigger — compact, secondary visual weight */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGenerating}
        className={`flex items-center gap-2 text-sm transition-colors group ${
          isOpen
            ? 'text-brand-400'
            : 'text-gray-500 hover:text-gray-300'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

        <span className="font-medium">
          {isOpen ? t('custom.trigger.open', uiLang) : t('custom.trigger', uiLang)}
        </span>

        {/* Chevron that rotates */}
        <motion.svg
          className="w-4 h-4"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>

        {/* Summary when collapsed */}
        {!isOpen && (
          <ConfigSummary
            contentLanguage={contentLanguage}
            tone={tone}
            length={length}
            perspective={perspective}
            uiLang={uiLang}
          />
        )}
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-5 p-5 mt-3 bg-gray-900/50 border border-gray-800 rounded-2xl">
              {/* Row 1: Language */}
              <LanguageSelector
                label={t('custom.language', uiLang)}
                value={contentLanguage}
                onChange={onContentLanguageChange}
                uiLang={uiLang}
              />

              {/* Row 2: Tone */}
              <SegmentedControl
                label={t('custom.tone', uiLang)}
                options={TONE_OPTIONS}
                value={tone}
                onChange={onToneChange}
                uiLang={uiLang}
              />

              {/* Row 3: Length */}
              <SegmentedControl
                label={t('custom.length', uiLang)}
                options={LENGTH_OPTIONS}
                value={length}
                onChange={onLengthChange}
                uiLang={uiLang}
              />

              {/* Row 4: Perspective */}
              <SegmentedControl
                label={t('custom.perspective', uiLang)}
                options={PERSPECTIVE_OPTIONS}
                value={perspective}
                onChange={onPerspectiveChange}
                uiLang={uiLang}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
