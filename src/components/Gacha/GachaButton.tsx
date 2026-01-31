import { motion } from 'framer-motion'

interface GachaButtonProps {
  onClick: () => void
  disabled: boolean
  remaining: number
  bonusCount: number
}

export default function GachaButton({ onClick, disabled, remaining, bonusCount }: GachaButtonProps) {
  const totalRemaining = remaining + bonusCount

  return (
    <div className="relative">
      {/* 外层旋转光圈 */}
      {!disabled && (
        <motion.div
          className="absolute inset-[-20px] rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(251, 191, 36, 0.3), transparent, rgba(251, 191, 36, 0.3), transparent)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* 呼吸光晕 */}
      {!disabled && (
        <motion.div
          className="absolute inset-[-10px] rounded-full bg-amber-500/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* 主按钮 */}
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative w-40 h-40 rounded-full
          flex flex-col items-center justify-center
          text-white font-bold text-xl
          overflow-hidden
          ${
            disabled
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-br from-amber-500 to-orange-600'
          }
        `}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        animate={disabled ? {
          x: [0, -2, 2, -2, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
        } : {}}
      >
        {/* 内部光效 */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* 图标和文字 */}
        <motion.span
          className="text-4xl mb-1 relative z-10"
          animate={disabled ? {} : {
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎴
        </motion.span>
        <span className="relative z-10">建造</span>
        <span className="text-sm mt-1 opacity-80 relative z-10">
          {disabled ? '明天再来' : `剩余 ${totalRemaining} 次`}
        </span>

        {/* 奖励次数标识 */}
        {bonusCount > 0 && !disabled && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            +{bonusCount}
          </motion.div>
        )}
      </motion.button>

      {/* 禁用时的遮罩 */}
      {disabled && (
        <div className="absolute inset-0 rounded-full bg-black/30" />
      )}
    </div>
  )
}
