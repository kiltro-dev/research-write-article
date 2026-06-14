/**
 * Detects the user's browser language and maps it to a supported UI language code.
 * Persists the user's explicit choice in localStorage.
 */
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'article-agent-ui-lang'
const STORAGE_PREFS_KEY = 'article-agent-preferences'

// Map browser locale to our supported codes
function mapBrowserToSupported(browserLang) {
  const code = (browserLang || 'es').split('-')[0].toLowerCase()
  const supported = ['es', 'en', 'pt', 'fr', 'it', 'de']
  return supported.includes(code) ? code : 'es'
}

export function useBrowserLanguage() {
  const [uiLanguage, setUiLanguage] = useState(() => {
    // Priority: localStorage > browser > default (es)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return stored
    return mapBrowserToSupported(navigator.language)
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, uiLanguage)
  }, [uiLanguage])

  const changeLanguage = useCallback((lang) => {
    setUiLanguage(lang)
  }, [])

  return { uiLanguage, changeLanguage }
}

// Default customization preferences
const DEFAULT_PREFS = {
  contentLanguage: 'es',
  tone: 'casual',
  length: 'medium',
  perspective: 'informative',
}

export function usePreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_PREFS, ...parsed }
      }
    } catch { /* ignore parse errors */ }

    // Auto-detect content language from browser
    const browserContentLang = mapBrowserToSupported(navigator.language)
    return { ...DEFAULT_PREFS, contentLanguage: browserContentLang }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(preferences))
  }, [preferences])

  const updatePreference = useCallback((key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }, [])

  return { preferences, updatePreference }
}
