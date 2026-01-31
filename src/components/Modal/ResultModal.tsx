import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Card } from '../../types'
import { getRarityStars, getRarityColor } from '../../utils/gacha'

interface ResultModalProps {
  card: Card | null
  isOpen: boolean
  isNew: boolean
  currentMastery: number
  onClose: () => void
}

// 稀有度边框样式
const getRarityBorderStyle = (rarity: number) => {
  switch (rarity) {
    case 1:
      return 'border-gray-400'
    case 2:
      return 'border-green-400'
    case 3:
      return 'border-blue-400'
    case 4:
      return 'border-purple-400'
    default:
      return 'border-gray-400'
  }
}

// 稀有度背景渐变
const getRarityBg = (rarity: number) => {
  switch (rarity) {
    case 1:
      return 'from-gray-700 to-gray-900'
    case 2:
      return 'from-green-800 to-green-950'
    case 3:
      return 'from-blue-800 to-blue-950'
    case 4:
      return 'from-purple-800 via-purple-900 to-indigo-950'
    default:
      return 'from-gray-700 to-gray-900'
  }
}

export default function ResultModal({ card, isOpen, isNew, currentMastery, onClose }: ResultModalProps) {
  const navigate = useNavigate()

  if (!isOpen || !card) return null

  const handleViewDetail = () => {
    onClose()
    navigate(`/card/${card.id}`)
  }

  const isMastered = currentMastery >= 3

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-sm w-full mx-4"
          onClick={(e) => e.stopPropagation()}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          {/* 4星特殊光效背景 */}
          {card.rarity === 4 && (
            <motion.div
              className="absolute inset-[-20px] rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blur-xl"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            />
          )}

          {/* 3星流动光边 */}
          {card.rarity === 3 && (
            <motion.div
              className="absolute inset-[-4px] rounded-2xl"
              style={{
                background: 'linear-gradient(90deg, transparent, #60A5FA, transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['100% 0%', '-100% 0%'],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* 卡牌主体 */}
          <motion.div
            className={`relative bg-gradient-to-b ${getRarityBg(card.rarity)} rounded-2xl p-6 border-2 ${getRarityBorderStyle(card.rarity)} overflow-hidden`}
          >
            {/* NEW 标识 */}
            {isNew && (
              <motion.div
                className="absolute top-3 right-3 z-10"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <motion.span
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold px-3 py-1 rounded-full text-sm"
                  animate={{
                    boxShadow: ['0 0 10px #FCD34D', '0 0 20px #FCD34D', '0 0 10px #FCD34D']
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  NEW!
                </motion.span>
              </motion.div>
            )}

            {/* 重复卡牌标识 */}
            {!isNew && (
              <motion.div
                className="absolute top-3 right-3 z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {isMastered ? (
                  <motion.span
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-3 py-1 rounded-full text-sm"
                    animate={{
                      boxShadow: ['0 0 5px #FBBF24', '0 0 15px #FBBF24', '0 0 5px #FBBF24']
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    已精通
                  </motion.span>
                ) : (
                  <motion.span
                    className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm"
                  >
                    掌握度 +1
                  </motion.span>
                )}
              </motion.div>
            )}

            {/* 稀有度星星 */}
            <motion.div
              className="text-center mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`text-2xl ${getRarityColor(card.rarity)}`}>
                {getRarityStars(card.rarity)}
              </span>
            </motion.div>

            {/* 卡牌图片 */}
            <motion.div
              className="w-32 h-40 mx-auto bg-gray-700/50 rounded-xl flex items-center justify-center text-6xl mb-4 relative overflow-hidden"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              📖
              {/* 4星粒子环绕 */}
              {card.rarity === 4 && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-purple-400"
                      animate={{
                        x: [0, Math.cos(i * Math.PI / 3) * 50, 0],
                        y: [0, Math.sin(i * Math.PI / 3) * 50, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>

            {/* 单词 */}
            <motion.h2
              className="text-2xl font-bold text-center mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {card.word}
            </motion.h2>

            {/* 描述 */}
            <motion.p
              className="text-gray-300 text-center text-sm mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {card.description}
            </motion.p>

            {/* 掌握度进度条（非新卡时显示） */}
            {!isNew && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>掌握度</span>
                  <span>{Math.min(currentMastery + 1, 3)} / 3</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: `${(currentMastery / 3) * 100}%` }}
                    animate={{ width: `${(Math.min(currentMastery + 1, 3) / 3) * 100}%` }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}

            {/* 例句 */}
            <motion.div
              className="bg-black/30 rounded-lg p-3 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm italic text-gray-300">"{card.examples[0]}"</p>
            </motion.div>

            {/* 按钮 */}
            <motion.div
              className="flex gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                继续抽卡
              </motion.button>
              <motion.button
                onClick={handleViewDetail}
                className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                查看详情
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
