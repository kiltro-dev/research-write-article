/**
 * Lightweight internationalization for the Article Agent Demo.
 * Supports: es, en, pt, fr, it, de
 * Usage: t('key', lang) → translated string
 */

const translations = {
  es: {
    // Hero
    'hero.badge': '🤖 Sistema Multi-Agente de IA',
    'hero.title.part1': 'Genera artículos con',
    'hero.title.highlight': 'agentes de IA',
    'hero.subtitle':
      'Tres agentes especializados — Planificador, Escritor y Editor — colaboran para investigar, escribir y pulir un artículo completo sobre cualquier tema.',
    'hero.cta': 'Probar la demo',

    // Topic Input
    'input.label': '¿Sobre qué tema quieres que escriban los agentes?',
    'input.placeholder': 'ej. "Inteligencia Artificial en la Salud"',
    'input.generate': 'Generar',
    'input.generating': 'Generando...',
    'input.footer': 'Potenciado por múltiples proveedores de IA con fallback automático',
    'input.minChars': 'Mínimo 3 caracteres',

    // Customization Panel
    'custom.trigger': 'Personalizar',
    'custom.trigger.open': 'Ocultar opciones',
    'custom.language': 'Idioma del artículo',
    'custom.tone': 'Tono',
    'custom.length': 'Longitud',
    'custom.perspective': 'Enfoque',
    'custom.summary': '{lang} · {tone} · {length} · {perspective}',

    // Progress
    'progress.title': 'Agentes trabajando',
    'progress.topic': 'Tema: {topic}',
    'progress.planning': 'Planificación',
    'progress.writing': 'Escritura',
    'progress.editing': 'Edición',

    // Result
    'result.title': '¡Artículo generado!',
    'result.poweredBy': 'Generado con {provider}',
    'result.copy': '📋 Copiar',
    'result.copied': '✓ ¡Copiado!',
    'result.regenerate': '🔄 Regenerar',
    'result.newTopic': '✨ Nuevo tema',

    // How it Works
    'how.title': 'Cómo funcionan los',
    'how.title.highlight': 'agentes',
    'how.subtitle':
      'Tres agentes de IA especializados colaboran en un pipeline — cada uno hace lo que mejor sabe hacer.',
    'how.planner.name': 'Planificador',
    'how.planner.role': 'Estratega de Contenido',
    'how.planner.desc':
      'Investiga el tema, identifica la audiencia y construye un esquema detallado con palabras clave SEO y puntos clave.',
    'how.writer.name': 'Escritor',
    'how.writer.role': 'Creador de Contenido',
    'how.writer.desc':
      'Redacta el artículo completo a partir del plan — introducción atractiva, cuerpo con profundidad y conclusión sólida.',
    'how.editor.name': 'Editor',
    'how.editor.role': 'Control de Calidad',
    'how.editor.desc':
      'Revisa gramática, estilo y voz de marca. Equilibra opiniones con hechos y asegura estándares periodísticos.',

    // Pipeline flow
    'how.flow.user': 'Usuario escribe un tema',
    'how.flow.result': '¡Artículo pulido ✨',

    // Footer
    'footer': 'Hecho con ❤️ para que escribas sobre lo que quieras',

    // Error
    'error.tryAgain': 'Intentar de nuevo',
  },

  en: {
    'hero.badge': '🤖 Multi-Agent AI System',
    'hero.title.part1': 'Generate articles with',
    'hero.title.highlight': 'AI agents',
    'hero.subtitle':
      'Three specialized agents — Planner, Writer, and Editor — collaborate to research, write, and polish a full article on any topic.',
    'hero.cta': 'Try the Demo',

    'input.label': 'What topic should the agents write about?',
    'input.placeholder': 'e.g. "Artificial Intelligence in Healthcare"',
    'input.generate': 'Generate',
    'input.generating': 'Generating...',
    'input.footer': 'Powered by multiple LLM providers with automatic fallback',
    'input.minChars': 'Minimum 3 characters',

    'custom.trigger': 'Customize',
    'custom.trigger.open': 'Hide options',
    'custom.language': 'Article language',
    'custom.tone': 'Tone',
    'custom.length': 'Length',
    'custom.perspective': 'Perspective',
    'custom.summary': '{lang} · {tone} · {length} · {perspective}',

    'progress.title': 'Agents at Work',
    'progress.topic': 'Topic: {topic}',
    'progress.planning': 'Planning',
    'progress.writing': 'Writing',
    'progress.editing': 'Editing',

    'result.title': 'Article Generated!',
    'result.poweredBy': 'Powered by {provider}',
    'result.copy': '📋 Copy',
    'result.copied': '✓ Copied!',
    'result.regenerate': '🔄 Regenerate',
    'result.newTopic': '✨ New Topic',

    'how.title': 'How the',
    'how.title.highlight': 'agents',
    'how.subtitle':
      'Three specialized AI agents collaborate in a pipeline — each one doing what it does best.',
    'how.planner.name': 'Planner',
    'how.planner.role': 'Content Strategist',
    'how.planner.desc':
      'Researches the topic, identifies the target audience, and builds a detailed outline with SEO keywords and key talking points.',
    'how.writer.name': 'Writer',
    'how.writer.role': 'Content Creator',
    'how.writer.desc':
      'Crafts the full article from the plan — engaging introduction, insightful body paragraphs, and a strong conclusion.',
    'how.editor.name': 'Editor',
    'how.editor.role': 'Quality Assurance',
    'how.editor.desc':
      'Proofreads the article for grammar, style, and brand voice. Balances opinions with facts and ensures journalistic standards.',

    'how.flow.user': 'User enters topic',
    'how.flow.result': 'Polished article ✨',

    'footer': 'Made with ❤️ so you can write about anything',

    'error.tryAgain': 'Try Again',
  },

  pt: {
    'hero.badge': '🤖 Sistema Multi-Agente de IA',
    'hero.title.part1': 'Gere artigos com',
    'hero.title.highlight': 'agentes de IA',
    'hero.subtitle':
      'Três agentes especializados — Planejador, Escritor e Editor — colaboram para pesquisar, escrever e polir um artigo completo sobre qualquer tema.',
    'hero.cta': 'Testar a Demo',
    'input.label': 'Sobre qual tema os agentes devem escrever?',
    'input.placeholder': 'ex. "Inteligência Artificial na Saúde"',
    'input.generate': 'Gerar',
    'input.generating': 'Gerando...',
    'input.footer': 'Potencializado por múltiplos provedores de IA com fallback automático',
    'input.minChars': 'Mínimo 3 caracteres',
    'custom.trigger': 'Personalizar',
    'custom.trigger.open': 'Ocultar opções',
    'custom.language': 'Idioma do artigo',
    'custom.tone': 'Tom',
    'custom.length': 'Comprimento',
    'custom.perspective': 'Perspectiva',
    'custom.summary': '{lang} · {tone} · {length} · {perspective}',
    'progress.title': 'Agentes Trabalhando',
    'progress.topic': 'Tema: {topic}',
    'progress.planning': 'Planejamento',
    'progress.writing': 'Escrita',
    'progress.editing': 'Edição',
    'result.title': 'Artigo Gerado!',
    'result.poweredBy': 'Gerado com {provider}',
    'result.copy': '📋 Copiar',
    'result.copied': '✓ Copiado!',
    'result.regenerate': '🔄 Regenerar',
    'result.newTopic': '✨ Novo Tema',
    'how.title': 'Como os',
    'how.title.highlight': 'agentes',
    'how.subtitle':
      'Três agentes de IA especializados colaboram em um pipeline — cada um fazendo o que faz de melhor.',
    'how.planner.name': 'Planejador',
    'how.planner.role': 'Estrategista de Conteúdo',
    'how.planner.desc':
      'Pesquisa o tema, identifica o público-alvo e constrói um esboço detalhado com palavras-chave SEO e pontos principais.',
    'how.writer.name': 'Escritor',
    'how.writer.role': 'Criador de Conteúdo',
    'how.writer.desc':
      'Redige o artigo completo a partir do plano — introdução envolvente, parágrafos com profundidade e uma conclusão forte.',
    'how.editor.name': 'Editor',
    'how.editor.role': 'Controle de Qualidade',
    'how.editor.desc':
      'Revisa gramática, estilo e voz da marca. Equilibra opiniões com fatos e garante padrões jornalísticos.',
    'how.flow.user': 'Usuário digita o tema',
    'how.flow.result': 'Artigo polido ✨',
    'footer': 'Feito com ❤️ para você escrever sobre o que quiser',
    'error.tryAgain': 'Tentar Novamente',
  },

  fr: {
    'hero.badge': '🤖 Système Multi-Agent IA',
    'hero.title.part1': 'Générez des articles avec des',
    'hero.title.highlight': 'agents IA',
    'hero.subtitle':
      'Trois agents spécialisés — Planificateur, Rédacteur et Éditeur — collaborent pour rechercher, rédiger et peaufiner un article complet sur n\'importe quel sujet.',
    'hero.cta': 'Essayer la Démo',
    'input.label': 'Sur quel sujet les agents doivent-ils écrire ?',
    'input.placeholder': 'ex. "L\'Intelligence Artificielle dans la Santé"',
    'input.generate': 'Générer',
    'input.generating': 'Génération...',
    'input.footer': 'Propulsé par plusieurs fournisseurs d\'IA avec fallback automatique',
    'input.minChars': 'Minimum 3 caractères',
    'custom.trigger': 'Personnaliser',
    'custom.trigger.open': 'Masquer les options',
    'custom.language': 'Langue de l\'article',
    'custom.tone': 'Ton',
    'custom.length': 'Longueur',
    'custom.perspective': 'Perspective',
    'custom.summary': '{lang} · {tone} · {length} · {perspective}',
    'progress.title': 'Agents au Travail',
    'progress.topic': 'Sujet : {topic}',
    'progress.planning': 'Planification',
    'progress.writing': 'Rédaction',
    'progress.editing': 'Édition',
    'result.title': 'Article Généré !',
    'result.poweredBy': 'Généré avec {provider}',
    'result.copy': '📋 Copier',
    'result.copied': '✓ Copié !',
    'result.regenerate': '🔄 Régénérer',
    'result.newTopic': '✨ Nouveau Sujet',
    'how.title': 'Comment fonctionnent les',
    'how.title.highlight': 'agents',
    'how.subtitle':
      'Trois agents IA spécialisés collaborent dans un pipeline — chacun fait ce qu\'il fait le mieux.',
    'how.planner.name': 'Planificateur',
    'how.planner.role': 'Stratège de Contenu',
    'how.planner.desc':
      'Recherche le sujet, identifie le public cible et construit un plan détaillé avec des mots-clés SEO et des points clés.',
    'how.writer.name': 'Rédacteur',
    'how.writer.role': 'Créateur de Contenu',
    'how.writer.desc':
      'Rédige l\'article complet à partir du plan — introduction engageante, paragraphes perspicaces et une conclusion solide.',
    'how.editor.name': 'Éditeur',
    'how.editor.role': 'Assurance Qualité',
    'how.editor.desc':
      'Relit l\'article pour la grammaire, le style et la voix de la marque. Équilibre les opinions avec les faits.',
    'how.flow.user': 'L\'utilisateur saisit un sujet',
    'how.flow.result': 'Article peaufiné ✨',
    'footer': 'Fait avec ❤️ pour écrire sur ce qui vous passionne',
    'error.tryAgain': 'Réessayer',
  },

  it: {
    'hero.badge': '🤖 Sistema Multi-Agente IA',
    'hero.title.part1': 'Genera articoli con',
    'hero.title.highlight': 'agenti IA',
    'hero.subtitle':
      'Tre agenti specializzati — Pianificatore, Scrittore ed Editore — collaborano per ricercare, scrivere e perfezionare un articolo completo su qualsiasi argomento.',
    'hero.cta': 'Prova la Demo',
    'input.label': 'Su quale argomento devono scrivere gli agenti?',
    'input.placeholder': 'es. "Intelligenza Artificiale nella Sanità"',
    'input.generate': 'Genera',
    'input.generating': 'Generando...',
    'input.footer': 'Alimentato da più fornitori IA con fallback automatico',
    'input.minChars': 'Minimo 3 caratteri',
    'custom.trigger': 'Personalizza',
    'custom.trigger.open': 'Nascondi opzioni',
    'custom.language': 'Lingua dell\'articolo',
    'custom.tone': 'Tono',
    'custom.length': 'Lunghezza',
    'custom.perspective': 'Prospettiva',
    'custom.summary': '{lang} · {tone} · {length} · {perspective}',
    'progress.title': 'Agenti al Lavoro',
    'progress.topic': 'Tema: {topic}',
    'progress.planning': 'Pianificazione',
    'progress.writing': 'Scrittura',
    'progress.editing': 'Revisione',
    'result.title': 'Articolo Generato!',
    'result.poweredBy': 'Generato con {provider}',
    'result.copy': '📋 Copia',
    'result.copied': '✓ Copiato!',
    'result.regenerate': '🔄 Rigenera',
    'result.newTopic': '✨ Nuovo Tema',
    'how.title': 'Come funzionano gli',
    'how.title.highlight': 'agenti',
    'how.subtitle':
      'Tre agenti IA specializzati collaborano in un pipeline — ognuno fa ciò che sa fare meglio.',
    'how.planner.name': 'Pianificatore',
    'how.planner.role': 'Stratega dei Contenuti',
    'how.planner.desc':
      'Ricerca l\'argomento, identifica il pubblico target e costruisce uno schema dettagliato con parole chiave SEO e punti chiave.',
    'how.writer.name': 'Scrittore',
    'how.writer.role': 'Creatore di Contenuti',
    'how.writer.desc':
      'Redige l\'articolo completo dal piano — introduzione coinvolgente, paragrafi approfonditi e una conclusione forte.',
    'how.editor.name': 'Editore',
    'how.editor.role': 'Controllo Qualità',
    'how.editor.desc':
      'Rivede l\'articolo per grammatica, stile e voce del marchio. Bilancia opinioni con fatti e garantisce standard giornalistici.',
    'how.flow.user': 'L\'utente inserisce un tema',
    'how.flow.result': 'Articolo perfezionato ✨',
    'footer': 'Fatto con ❤️ per scrivere di ciò che ti appassiona',
    'error.tryAgain': 'Riprova',
  },

  de: {
    'hero.badge': '🤖 Multi-Agenten KI-System',
    'hero.title.part1': 'Generieren Sie Artikel mit',
    'hero.title.highlight': 'KI-Agenten',
    'hero.subtitle':
      'Drei spezialisierte Agenten — Planer, Autor und Redakteur — arbeiten zusammen, um einen vollständigen Artikel zu jedem Thema zu recherchieren, zu schreiben und zu perfektionieren.',
    'hero.cta': 'Demo testen',
    'input.label': 'Zu welchem Thema sollen die Agenten schreiben?',
    'input.placeholder': 'z.B. "Künstliche Intelligenz im Gesundheitswesen"',
    'input.generate': 'Generieren',
    'input.generating': 'Generierung...',
    'input.footer': 'Betrieben von mehreren KI-Anbietern mit automatischem Fallback',
    'input.minChars': 'Mindestens 3 Zeichen',
    'custom.trigger': 'Anpassen',
    'custom.trigger.open': 'Optionen ausblenden',
    'custom.language': 'Artikelsprache',
    'custom.tone': 'Ton',
    'custom.length': 'Länge',
    'custom.perspective': 'Perspektive',
    'custom.summary': '{lang} · {tone} · {length} · {perspective}',
    'progress.title': 'Agenten bei der Arbeit',
    'progress.topic': 'Thema: {topic}',
    'progress.planning': 'Planung',
    'progress.writing': 'Schreiben',
    'progress.editing': 'Redaktion',
    'result.title': 'Artikel generiert!',
    'result.poweredBy': 'Generiert mit {provider}',
    'result.copy': '📋 Kopieren',
    'result.copied': '✓ Kopiert!',
    'result.regenerate': '🔄 Neu generieren',
    'result.newTopic': '✨ Neues Thema',
    'how.title': 'Wie die',
    'how.title.highlight': 'Agenten',
    'how.subtitle':
      'Drei spezialisierte KI-Agenten arbeiten in einer Pipeline zusammen — jeder tut, was er am besten kann.',
    'how.planner.name': 'Planer',
    'how.planner.role': 'Content-Stratege',
    'how.planner.desc':
      'Recherchiert das Thema, identifiziert die Zielgruppe und erstellt eine detaillierte Gliederung mit SEO-Schlüsselwörtern und Kernpunkten.',
    'how.writer.name': 'Autor',
    'how.writer.role': 'Content-Ersteller',
    'how.writer.desc':
      'Verfasst den vollständigen Artikel basierend auf dem Plan — einleitender Einstieg, tiefgründige Absätze und ein starkes Fazit.',
    'how.editor.name': 'Redakteur',
    'how.editor.role': 'Qualitätssicherung',
    'how.editor.desc':
      'Überprüft den Artikel auf Grammatik, Stil und Markenstimme. Gleicht Meinungen mit Fakten ab und gewährleistet journalistische Standards.',
    'how.flow.user': 'Benutzer gibt Thema ein',
    'how.flow.result': 'Perfektionierter Artikel ✨',
    'footer': 'Mit ❤️ gemacht — schreib über alles, was dich interessiert',
    'error.tryAgain': 'Erneut versuchen',
  },
}

/**
 * Translate a key into the target language.
 * Falls back to Spanish if the language or key is missing.
 */
export function t(key, lang = 'es') {
  const dict = translations[lang] || translations['es']
  return dict[key] || translations['es'][key] || key
}

/**
 * Format a translation key with substitution values.
 * Example: tf('progress.topic', 'es', { topic: 'AI' })
 */
export function tf(key, lang, params = {}) {
  let text = t(key, lang)
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(`{${k}}`, v)
  }
  return text
}

export const SUPPORTED_UI_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

export const CONTENT_LANGUAGES = SUPPORTED_UI_LANGUAGES

export const TONE_OPTIONS = [
  { value: 'casual', label_es: 'Casual', label_en: 'Casual' },
  { value: 'formal', label_es: 'Formal', label_en: 'Formal' },
  { value: 'editorial', label_es: 'Editorial', label_en: 'Editorial' },
  { value: 'technical', label_es: 'Técnico', label_en: 'Technical' },
  { value: 'inspirational', label_es: 'Inspirador', label_en: 'Inspirational' },
]

export const LENGTH_OPTIONS = [
  { value: 'short', label_es: 'Corto', label_en: 'Short' },
  { value: 'medium', label_es: 'Medio', label_en: 'Medium' },
  { value: 'long', label_es: 'Largo', label_en: 'Long' },
]

export const PERSPECTIVE_OPTIONS = [
  { value: 'informative', label_es: 'Informativo', label_en: 'Informative' },
  { value: 'persuasive', label_es: 'Persuasivo', label_en: 'Persuasive' },
  { value: 'analytical', label_es: 'Analítico', label_en: 'Analytical' },
]
