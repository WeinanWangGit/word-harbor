import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cards } from '../data/cards'
import { useUserStore } from '../store/useUserStore'
import { getRarityStars, getRarityColor, getRarityGradient } from '../utils/gacha'

type FilterType = 'all' | 'owned' | 'notOwned'
type SortType = 'rarity' | 'mastery'

export default function Collection() {
  const { ownedCardIds, masteryMap, newCardIds, clearNewCardIds, initializeFromStorage } = useUserStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('rarity')
  const [animatedNewCards, setAnimatedNewCards] = useState<string[]>([])

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  // 记录需要播放动画的新卡
  useEffect(() => {
    if (newCardIds.length > 0) {
      setAnimatedNewCards(newCardIds)
      // 延迟清除，让动画播放完
      const timer = setTimeout(() => {
        clearNewCardIds()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [newCardIds, clearNewCardIds])

  // 过滤和排序卡牌
  const displayCards = cards
    .filter((card) => {
      const isOwned = ownedCardIds.includes(card.id)
      if (filter === 'owned') return isOwned
      if (filter === 'notOwned') return !isOwned
      return true
    })
    .sort((a, b) => {
      if (sort === 'rarity') {
        return b.rarity - a.rarity
      }
      const masteryA = masteryMap[a.id] ?? 0
      const masteryB = masteryMap[b.id] ?? 0
      return masteryB - masteryA
    })

  const ownedCount = ownedCardIds.length
  const totalCount = cards.length
  const completionRate = Math.round((ownedCount / totalCount) * 100)

  return (
    <div className="flex-1 p-4 lg:p-6 pb-20">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          图鉴
        </h1>
        <p className="text-gray-400 text-sm mt-1">收集进度</p>
      </div>

      {/* 统计信息 */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">收集进度</span>
          <span className="text-amber-400 font-bold">
            {ownedCount} / {totalCount}
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-right text-sm text-gray-400 mt-1">{completionRate}%</p>
      </div>

      {/* 筛选和排序 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
          {(['all', 'owned', 'notOwned'] as FilterType[]).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === f ? 'bg-amber-500 text-white' : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {f === 'all' ? '全部' : f === 'owned' ? '已拥有' : '未拥有'}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
          {(['rarity', 'mastery'] as SortType[]).map((s) => (
            <motion.button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                sort === s ? 'bg-amber-500 text-white' : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {s === 'rarity' ? '稀有度' : '掌握度'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 卡牌网格 */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {displayCards.map((card, index) => {
            const isOwned = ownedCardIds.includes(card.id)
            const mastery = masteryMap[card.id] ?? 0
            const isNewlyUnlocked = animatedNewCards.includes(card.id)
            const isMastered = mastery >= 3

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/card/${card.id}`}
                  className="block"
                >
                  <motion.div
                    className={`relative rounded-xl overflow-hidden transition-all ${
                      isOwned ? '' : 'grayscale'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* 新卡点亮动画 */}
                    {isNewlyUnlocked && (
                      <motion.div
                        className="absolute inset-0 bg-white z-20 rounded-xl"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                      />
                    )}

                    {/* 满级光效 */}
                    {isMastered && isOwned && (
                      <motion.div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.3) 0%, transparent 60%)',
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    <div className={`bg-gradient-to-b ${getRarityGradient(card.rarity)} p-2 h-32 relative`}>
                      {/* 卡牌图片 */}
                      <motion.div
                        className="h-16 bg-gray-700/50 rounded-lg flex items-center justify-center text-2xl mb-1"
                        animate={!isOwned ? {
                          rotate: [-2, 2, -2],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {isOwned ? '📖' : '❓'}
                      </motion.div>

                      {/* 稀有度 */}
                      <p className={`text-xs text-center ${getRarityColor(card.rarity)}`}>
                        {getRarityStars(card.rarity)}
                      </p>

                      {/* 单词 */}
                      <p className="text-xs text-center truncate font-semibold">
                        {isOwned ? card.word : '???'}
                      </p>

                      {/* 掌握度指示器 */}
                      {isOwned && (
                        <div className="absolute top-1 right-1 flex gap-0.5">
                          {[1, 2, 3].map((level) => (
                            <motion.div
                              key={level}
                              className={`w-2 h-2 rounded-full ${
                                mastery >= level
                                  ? isMastered ? 'bg-amber-400' : 'bg-amber-400'
                                  : 'bg-gray-600'
                              }`}
                              initial={isNewlyUnlocked ? { scale: 0 } : { scale: 1 }}
                              animate={{
                                scale: 1,
                                boxShadow: isMastered && mastery >= level
                                  ? ['0 0 3px #FBBF24', '0 0 8px #FBBF24', '0 0 3px #FBBF24']
                                  : 'none',
                              }}
                              transition={{
                                scale: { delay: level * 0.1 },
                                boxShadow: { duration: 1.5, repeat: Infinity },
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* 未拥有遮罩 */}
                      {!isOwned && (
                        <div className="absolute inset-0 bg-black/40 rounded-xl" />
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 空状态 */}
      {displayCards.length === 0 && (
        <motion.div
          className="text-center py-12 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-4xl mb-4">📭</p>
          <p>没有符合条件的卡牌</p>
        </motion.div>
      )}
    </div>
  )
}
