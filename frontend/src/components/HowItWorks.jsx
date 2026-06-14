import { motion } from 'framer-motion'
import { t } from '../i18n'

const AGENTS = [
  {
    key: 'planner',
    emoji: '📋',
    color: 'border-blue-500/30 bg-blue-500/5',
  },
  {
    key: 'writer',
    emoji: '✍️',
    color: 'border-purple-500/30 bg-purple-500/5',
  },
  {
    key: 'editor',
    emoji: '✅',
    color: 'border-green-500/30 bg-green-500/5',
  },
]

const CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function HowItWorks({ uiLang }) {
  return (
    <section id="how-it-works" className="pt-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {t('how.title', uiLang)}{' '}
          <span className="gradient-text">{t('how.title.highlight', uiLang)}</span>{' '}
          {uiLang === 'en' || uiLang === 'pt' || uiLang === 'it' ? 'work' : ''}
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {t('how.subtitle', uiLang)}
        </p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-3 gap-6"
        variants={CONTAINER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {AGENTS.map((agent) => (
          <motion.div
            key={agent.key}
            variants={ITEM}
            className={`glow-card p-6 border ${agent.color} flex flex-col items-center text-center`}
          >
            <span className="text-4xl mb-4">{agent.emoji}</span>
            <h3 className="font-bold text-lg text-white mb-1">
              {t(`how.${agent.key}.name`, uiLang)}
            </h3>
            <span className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
              {t(`how.${agent.key}.role`, uiLang)}
            </span>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(`how.${agent.key}.desc`, uiLang)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pipeline flow arrow */}
      <motion.div
        className="flex justify-center items-center gap-2 mt-8 text-gray-600 text-sm flex-wrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span>{t('how.flow.user', uiLang)}</span>
        <span>→</span>
        <span className="text-blue-400">{t('progress.planning', uiLang)}</span>
        <span>→</span>
        <span className="text-purple-400">{t('progress.writing', uiLang)}</span>
        <span>→</span>
        <span className="text-green-400">{t('progress.editing', uiLang)}</span>
        <span>→</span>
        <span>{t('how.flow.result', uiLang)}</span>
      </motion.div>
    </section>
  )
}
