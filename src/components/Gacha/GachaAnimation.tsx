import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GachaAnimationProps {
  isPlaying: boolean
  rarity: number
  onComplete: () => void
}

type Phase = 'charging' | 'building' | 'revealing' | 'done'

// 根据稀有度获取颜色
const getRarityColors = (rarity: number) => {
  switch (rarity) {
    case 1:
      return { main: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.5)' } // 灰色
    case 2:
      return { main: '#4ADE80', glow: 'rgba(74, 222, 128, 0.5)' } // 绿色
    case 3:
      return { main: '#60A5FA', glow: 'rgba(96, 165, 250, 0.6)' } // 蓝色
    case 4:
      return { main: '#A855F7', glow: 'rgba(168, 85, 247, 0.7)' } // 紫色
    default:
      return { main: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.5)' }
  }
}

// 根据稀有度获取建造时长
const getBuildDuration = (rarity: number) => {
  switch (rarity) {
    case 1:
    case 2:
      return 1000
    case 3:
      return 1500
    case 4:
      return 2000
    default:
      return 1000
  }
}

export default function GachaAnimation({ isPlaying, rarity, onComplete }: GachaAnimationProps) {
  const [phase, setPhase] = useState<Phase>('charging')
  const colors = getRarityColors(rarity)
  const buildDuration = getBuildDuration(rarity)

  useEffect(() => {
    if (!isPlaying) {
      setPhase('charging')
      return
    }

    // 阶段1：蓄力 (500ms)
    setPhase('charging')

    const timer1 = setTimeout(() => {
      // 阶段2：建造
      setPhase('building')
    }, 500)

    const timer2 = setTimeout(() => {
      // 阶段3：揭示
      setPhase('revealing')
    }, 500 + buildDuration)

    const timer3 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 500 + buildDuration + 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [isPlaying, buildDuration, onComplete])

  if (!isPlaying) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景变暗 */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'charging' ? 0.7 : 0.9 }}
        transition={{ duration: 0.5 }}
      />

      {/* 阶段1：蓄力 - 中心光点 */}
      <AnimatePresence>
        {phase === 'charging' && (
          <motion.div
            className="absolute w-4 h-4 rounded-full bg-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            style={{ boxShadow: `0 0 30px 15px ${colors.glow}` }}
          />
        )}
      </AnimatePresence>

      {/* 阶段2：建造 - 光环扩张收缩 */}
      <AnimatePresence>
        {phase === 'building' && (
          <>
            {/* 主光环 */}
            <motion.div
              className="absolute rounded-full border-4"
              style={{ borderColor: colors.main }}
              initial={{ width: 20, height: 20, opacity: 0 }}
              animate={{
                width: [20, 150, 80, 150, 80],
                height: [20, 150, 80, 150, 80],
                opacity: 1,
              }}
              transition={{
                duration: buildDuration / 1000,
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
            />

            {/* 内部光芒 */}
            <motion.div
              className="absolute rounded-full"
              style={{ backgroundColor: colors.glow }}
              initial={{ width: 10, height: 10 }}
              animate={{
                width: [10, 60, 30, 60],
                height: [10, 60, 30, 60],
                opacity: [0.8, 0.4, 0.8, 0.4],
              }}
              transition={{
                duration: buildDuration / 1000,
                repeat: Infinity,
              }}
            />

            {/* 3星以上：额外粒子 */}
            {rarity >= 3 && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.main }}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                      x: Math.cos((i * Math.PI) / 4) * 100,
                      y: Math.sin((i * Math.PI) / 4) * 100,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </>
            )}

            {/* 4星：旋转光圈 */}
            {rarity === 4 && (
              <motion.div
                className="absolute w-48 h-48 rounded-full border-2 border-purple-400/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* 阶段3：揭示 - 爆开效果 */}
      <AnimatePresence>
        {phase === 'revealing' && (
          <>
            {/* 爆炸光环 */}
            <motion.div
              className="absolute rounded-full"
              style={{ backgroundColor: colors.main }}
              initial={{ width: 80, height: 80, opacity: 1 }}
              animate={{ width: 500, height: 500, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* 1星：普通散开 */}
            {rarity === 1 && (
              <motion.div
                className="absolute w-20 h-20 rounded-full bg-gray-400"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}

            {/* 2星：绿色光芒 */}
            {rarity === 2 && (
              <>
                <motion.div
                  className="absolute w-32 h-32 rounded-full bg-green-400"
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-green-300"
                    initial={{ x: 0, y: 0 }}
                    animate={{
                      x: Math.cos((i * Math.PI) / 3) * 150,
                      y: Math.sin((i * Math.PI) / 3) * 150,
                      opacity: [1, 0],
                    }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </>
            )}

            {/* 3星：蓝色光柱 + 粒子 */}
            {rarity === 3 && (
              <>
                {/* 光柱 */}
                <motion.div
                  className="absolute w-4 bg-gradient-to-t from-blue-500 via-blue-300 to-transparent"
                  style={{ height: '100vh' }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 1, 0], scaleY: 1 }}
                  transition={{ duration: 0.6 }}
                />
                {/* 粒子 */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-blue-400"
                    initial={{ x: 0, y: 0, scale: 1 }}
                    animate={{
                      x: (Math.random() - 0.5) * 300,
                      y: (Math.random() - 0.5) * 300,
                      scale: 0,
                      opacity: [1, 0],
                    }}
                    transition={{ duration: 0.6, delay: i * 0.02 }}
                  />
                ))}
              </>
            )}

            {/* 4星：紫色全屏闪光 + 彩虹粒子雨 */}
            {rarity === 4 && (
              <>
                {/* 全屏闪光 */}
                <motion.div
                  className="absolute inset-0 bg-purple-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.4 }}
                />
                {/* 光柱 */}
                <motion.div
                  className="absolute w-8 bg-gradient-to-t from-purple-600 via-purple-400 to-pink-300"
                  style={{ height: '100vh' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5] }}
                  transition={{ duration: 0.5 }}
                />
                {/* 彩虹粒子 */}
                {[...Array(30)].map((_, i) => {
                  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[i % colors.length] }}
                      initial={{
                        x: (Math.random() - 0.5) * 100,
                        y: -50,
                        scale: 1,
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 400,
                        y: 400,
                        scale: 0,
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.03,
                        ease: 'easeOut',
                      }}
                    />
                  )
                })}
              </>
            )}
          </>
        )}
      </AnimatePresence>

      {/* 建造中文字 */}
      {phase === 'building' && (
        <motion.p
          className="absolute bottom-32 text-xl font-bold"
          style={{ color: colors.main }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          建造中...
        </motion.p>
      )}
    </motion.div>
  )
}
