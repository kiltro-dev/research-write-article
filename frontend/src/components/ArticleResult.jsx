import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { t, tf, CONTENT_LANGUAGES, TONE_OPTIONS, LENGTH_OPTIONS, PERSPECTIVE_OPTIONS } from '../i18n'

export default function ArticleResult({ article, topic, provider, usedConfig, onRegenerate, onNewTopic, uiLang }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(article)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = article
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Build config badge labels
  const langName = usedConfig
    ? CONTENT_LANGUAGES.find((l) => l.code === usedConfig.contentLanguage)?.name
    : null
  const toneLabel = usedConfig
    ? TONE_OPTIONS.find((o) => o.value === usedConfig.tone)?.[`label_${uiLang}`]
    : null
  const lengthLabel = usedConfig
    ? LENGTH_OPTIONS.find((o) => o.value === usedConfig.length)?.[`label_${uiLang}`]
    : null
  const perspLabel = usedConfig
    ? PERSPECTIVE_OPTIONS.find((o) => o.value === usedConfig.perspective)?.[`label_${uiLang}`]
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Success banner with config badges */}
      <div className="glow-card border-green-500/30 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="font-semibold text-green-400">
              {t('result.title', uiLang)}
            </h3>
            <p className="text-sm text-gray-400">
              <strong className="text-gray-200">{topic}</strong>
              {provider && (
                <>
                  {' '}&middot; {tf('result.poweredBy', uiLang, { provider })}
                </>
              )}
            </p>
            {/* Config badges */}
            {usedConfig && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  🌐 {langName || usedConfig.contentLanguage}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  ✍️ {toneLabel || usedConfig.tone}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  📏 {lengthLabel || usedConfig.length}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  🔍 {perspLabel || usedConfig.perspective}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            {copied ? t('result.copied', uiLang) : t('result.copy', uiLang)}
          </button>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm font-medium transition-colors"
          >
            {t('result.regenerate', uiLang)}
          </button>
          <button
            onClick={onNewTopic}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            {t('result.newTopic', uiLang)}
          </button>
        </div>
      </div>

      {/* Article content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glow-card p-6 sm:p-10"
      >
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-strong:text-white
          prose-ul:text-gray-300 prose-ol:text-gray-300
          prose-li:text-gray-300
          prose-a:text-brand-400 hover:prose-a:text-brand-300
          prose-code:text-brand-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
          prose-blockquote:text-gray-400 prose-blockquote:border-brand-500
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article}</ReactMarkdown>
        </div>
      </motion.article>
    </motion.div>
  )
}
