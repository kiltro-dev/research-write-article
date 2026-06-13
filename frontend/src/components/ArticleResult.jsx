import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function ArticleResult({ article, topic, provider, onRegenerate, onNewTopic }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(article)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Success banner */}
      <div className="glow-card border-green-500/30 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="font-semibold text-green-400">Article Generated!</h3>
            <p className="text-sm text-gray-400">
              Topic: <strong className="text-gray-200">{topic}</strong>
              {provider && (
                <>
                  {' '}&middot; Powered by{' '}
                  <span className="text-brand-400 capitalize">{provider}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm font-medium transition-colors"
          >
            🔄 Regenerate
          </button>
          <button
            onClick={onNewTopic}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            ✨ New Topic
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
          <ReactMarkdown>{article}</ReactMarkdown>
        </div>
      </motion.article>
    </motion.div>
  )
}
