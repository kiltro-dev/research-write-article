import { motion } from 'framer-motion'

const AGENTS = [
  {
    emoji: '📋',
    name: 'Planner',
    role: 'Content Strategist',
    description:
      'Researches the topic, identifies the target audience, and builds a detailed outline with SEO keywords and key talking points.',
    color: 'border-blue-500/30 bg-blue-500/5',
  },
  {
    emoji: '✍️',
    name: 'Writer',
    role: 'Content Creator',
    description:
      'Crafts the full article from the plan — engaging introduction, insightful body paragraphs, and a strong conclusion.',
    color: 'border-purple-500/30 bg-purple-500/5',
  },
  {
    emoji: '✅',
    name: 'Editor',
    role: 'Quality Assurance',
    description:
      'Proofreads the article for grammar, style, and brand voice. Balances opinions with facts and ensures journalistic standards.',
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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="pt-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          How the <span className="gradient-text">agents</span> work
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Three specialized AI agents collaborate in a pipeline — each one doing what it does best.
        </p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-3 gap-6"
        variants={CONTAINER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {AGENTS.map((agent, i) => (
          <motion.div
            key={agent.name}
            variants={ITEM}
            className={`glow-card p-6 border ${agent.color} flex flex-col items-center text-center`}
          >
            <span className="text-4xl mb-4">{agent.emoji}</span>
            <h3 className="font-bold text-lg text-white mb-1">{agent.name}</h3>
            <span className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
              {agent.role}
            </span>
            <p className="text-sm text-gray-400 leading-relaxed">
              {agent.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pipeline flow arrow for mobile/visual */}
      <motion.div
        className="flex justify-center items-center gap-2 mt-8 text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span>User enters topic</span>
        <span>→</span>
        <span className="text-blue-400">Plan</span>
        <span>→</span>
        <span className="text-purple-400">Write</span>
        <span>→</span>
        <span className="text-green-400">Edit</span>
        <span>→</span>
        <span>Polished article ✨</span>
      </motion.div>
    </section>
  )
}
