import { motion } from 'framer-motion'
import { t } from '../i18n'

export default function Hero({ uiLang }) {
  return (
    <header className="relative pt-24 pb-16 px-4 text-center overflow-hidden">
      {/* Background gradient blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-brand-500/10 text-brand-400 border border-brand-500/30 rounded-full">
          {t('hero.badge', uiLang)}
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          {t('hero.title.part1', uiLang)}{' '}
          <span className="gradient-text">{t('hero.title.highlight', uiLang)}</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
          {t('hero.subtitle', uiLang)}
        </p>

        <motion.a
          href="#demo"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-2xl transition-all hover:scale-105 shadow-lg shadow-brand-600/25"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('hero.cta', uiLang)}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.a>
      </motion.div>
    </header>
  )
}
