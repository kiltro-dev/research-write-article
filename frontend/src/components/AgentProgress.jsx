import { motion } from 'framer-motion'

const STEP_ICONS = {
  planning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  writing: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  editing: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M5 13l4 4L19 7" />
    </svg>
  ),
}

const STATUS_COLORS = {
  running: 'border-brand-400 text-brand-400 bg-brand-400/10',
  completed: 'border-green-400 text-green-400 bg-green-400/10',
  pending: 'border-gray-700 text-gray-600 bg-gray-800/50',
  error: 'border-red-400 text-red-400 bg-red-400/10',
}

const STATUS_DOTS = {
  running: (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500" />
    </span>
  ),
  completed: (
    <span className="flex h-3 w-3 rounded-full bg-green-500" />
  ),
  pending: (
    <span className="flex h-3 w-3 rounded-full bg-gray-700" />
  ),
  error: (
    <span className="flex h-3 w-3 rounded-full bg-red-500" />
  ),
}

export default function AgentProgress({ steps, topic }) {
  return (
    <div className="glow-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex -space-x-1">
          {['🤖', '✍️', '✅'].map((emoji, i) => (
            <span key={i} className="text-xl">{emoji}</span>
          ))}
        </div>
        <div>
          <h3 className="font-semibold text-gray-200">Agents at Work</h3>
          <p className="text-sm text-gray-500 truncate max-w-xs">
            Topic: {topic}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {steps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
              STATUS_COLORS[step.status]
            }`}
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`absolute left-[2.15rem] top-14 w-0.5 h-4 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}

            {/* Icon */}
            <div className="relative z-10 flex-shrink-0">
              {step.status === 'running' ? (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {STEP_ICONS[step.step]}
                </motion.div>
              ) : (
                STEP_ICONS[step.step]
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">
                  {step.step === 'planning' ? 'Planning' :
                   step.step === 'writing' ? 'Writing' : 'Editing'}
                </span>
                {STATUS_DOTS[step.status]}
              </div>
              <p className="text-xs mt-1 opacity-80 truncate">
                {step.message}
              </p>
            </div>

            {/* Check mark when done */}
            {step.status === 'completed' && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 text-green-400 flex-shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
