import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore, getTotalGachaRemaining } from '../store/useUserStore'
import { getCardById } from '../data/cards'
import { getRarityColor, getRarityGradient, getRarityStars } from '../utils/gacha'

export default function Home() {
  const navigate = useNavigate()
  const {
    ownedCardIds,
    dailyGachaRemaining,
    bonusGacha,
    secretaryCardId,
    dailyReviewDone,
    masteryMap,
    setSecretaryCard,
    initializeFromStorage,
  } = useUserStore()

  const [showQuote, setShowQuote] = useState(false)
  const [currentQuote, setCurrentQuote] = useState('')
  const [showCardSelector, setShowCardSelector] = useState(false)

  const totalRemaining = getTotalGachaRemaining({ dailyGachaRemaining, bonusGacha } as any)
  const secretaryCard = secretaryCardId ? getCardById(secretaryCardId) : null

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  // 点击秘书舰显示随机例句
  const handleSecretaryClick = () => {
    if (secretaryCard) {
      const randomExample = secretaryCard.examples[Math.floor(Math.random() * secretaryCard.examples.length)]
      setCurrentQuote(randomExample)
      setShowQuote(true)
      setTimeout(() => setShowQuote(false), 3000)
    }
  }

  // 长按进入详情页
  const handleSecretaryLongPress = () => {
    if (secretaryCardId) {
      navigate(`/card/${secretaryCardId}`)
    }
  }

  // 切换秘书舰
  const handleSelectSecretary = (cardId: string) => {
    setSecretaryCard(cardId)
    setShowCardSelector(false)
  }

  return (
    <div className="flex-1 p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Word Harbor
        </h1>
        <p className="text-gray-400 text-sm mt-1">单词港湾</p>
      </div>

      {/* 抽卡次数 + 每日复习 */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">今日抽卡</p>
          <p className="text-3xl font-bold text-amber-400 mt-1">
            {totalRemaining}
            <span className="text-lg text-gray-500"> 次</span>
          </p>
          {bonusGacha > 0 && (
            <p className="text-xs text-green-400 mt-1">含奖励 {bonusGacha} 次</p>
          )}
        </div>

        {ownedCardIds.length > 0 && (
          <Link
            to="/review"
            className={`flex-1 rounded-xl p-4 text-center transition-all ${
              dailyReviewDone
                ? 'bg-gray-800/30 opacity-50'
                : 'bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700'
            }`}
          >
            <p className="text-gray-200 text-sm">每日复习</p>
            <p className="text-2xl mt-1">
              {dailyReviewDone ? '✅' : '📝'}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {dailyReviewDone ? '已完成' : '答对奖励抽卡'}
            </p>
          </Link>
        )}
      </div>

      {/* 秘书舰展示 */}
      {secretaryCard ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">秘书舰</h2>
            <button
              onClick={() => setShowCardSelector(true)}
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              更换
            </button>
          </div>

          <motion.div
            className={`relative bg-gradient-to-b ${getRarityGradient(secretaryCard.rarity)} rounded-2xl p-6 overflow-hidden`}
            onClick={handleSecretaryClick}
            onContextMenu={(e) => {
              e.preventDefault()
              handleSecretaryLongPress()
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* 氛围光 */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${
                  secretaryCard.rarity === 4 ? '#A855F7' :
                  secretaryCard.rarity === 3 ? '#60A5FA' :
                  secretaryCard.rarity === 2 ? '#4ADE80' : '#9CA3AF'
                } 0%, transparent 70%)`,
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* 卡牌内容 */}
            <div className="relative flex items-center gap-4">
              {/* 卡牌图片 - 浮动效果 */}
              <motion.div
                className="w-24 h-32 bg-gray-700/50 rounded-xl flex items-center justify-center text-5xl flex-shrink-0"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                📖
              </motion.div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${getRarityColor(secretaryCard.rarity)}`}>
                  {getRarityStars(secretaryCard.rarity)}
                </p>
                <h3 className="text-xl font-bold truncate">{secretaryCard.word}</h3>
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                  {secretaryCard.description}
                </p>

                {/* 掌握度 */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((level) => (
                    <motion.div
                      key={level}
                      className={`w-3 h-3 rounded-full ${
                        (masteryMap[secretaryCard.id] ?? 0) >= level
                          ? 'bg-amber-400'
                          : 'bg-gray-600'
                      }`}
                      animate={
                        (masteryMap[secretaryCard.id] ?? 0) >= 3
                          ? { boxShadow: ['0 0 5px #FBBF24', '0 0 10px #FBBF24', '0 0 5px #FBBF24'] }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 例句气泡 */}
            <AnimatePresence>
              {showQuote && (
                <motion.div
                  className="absolute top-2 left-2 right-2 bg-black/80 rounded-lg p-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-sm italic text-amber-200">"{currentQuote}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 提示 */}
            <p className="text-xs text-gray-400 text-center mt-3">
              点击查看例句 · 右键进入详情
            </p>
          </motion.div>
        </div>
      ) : (
        /* 无秘书舰时的欢迎界面 */
        <div className="mb-6 text-center py-12 bg-gray-800/30 rounded-2xl">
          <p className="text-5xl mb-4">🚢</p>
          <p className="text-gray-400">你的港区还没有成员</p>
          <p className="text-sm text-gray-500 mt-2">去抽卡页面抽取你的第一张卡牌吧！</p>
          <Link
            to="/gacha"
            className="inline-block mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg font-semibold transition-colors"
          >
            前往建造
          </Link>
        </div>
      )}

      {/* 收藏统计 */}
      <div className="bg-gray-800/30 rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">已收集</p>
        <p className="text-2xl font-bold">
          <span className="text-amber-400">{ownedCardIds.length}</span>
          <span className="text-gray-500 text-lg"> / 12 张卡牌</span>
        </p>
        <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${(ownedCardIds.length / 12) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 秘书舰选择弹窗 */}
      <AnimatePresence>
        {showCardSelector && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCardSelector(false)}
          >
            <motion.div
              className="bg-gray-900 w-full max-w-md rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4 text-center">选择秘书舰</h3>
              <div className="grid grid-cols-3 gap-3">
                {ownedCardIds.map((cardId) => {
                  const card = getCardById(cardId)
                  if (!card) return null
                  return (
                    <motion.button
                      key={cardId}
                      className={`p-2 rounded-xl ${getRarityGradient(card.rarity)} bg-gradient-to-b ${
                        secretaryCardId === cardId ? 'ring-2 ring-amber-400' : ''
                      }`}
                      onClick={() => handleSelectSecretary(cardId)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-3xl mb-1">📖</div>
                      <p className="text-xs truncate">{card.word}</p>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
