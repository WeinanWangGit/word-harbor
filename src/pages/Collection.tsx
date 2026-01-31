import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cards } from '../data/cards'
import { useUserStore } from '../store/useUserStore'
import { getRarityStars, getRarityColor, getRarityGradient } from '../utils/gacha'

type FilterType = 'all' | 'owned' | 'notOwned'
type SortType = 'rarity' | 'mastery'

export default function Collection() {
  const { ownedCardIds, masteryMap, initializeFromStorage } = useUserStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('rarity')

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

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
    <div className="flex-1 p-4 pb-20">
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
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-right text-sm text-gray-400 mt-1">{completionRate}%</p>
      </div>

      {/* 筛选和排序 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === 'all' ? 'bg-amber-500 text-white' : 'text-gray-400'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('owned')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === 'owned' ? 'bg-amber-500 text-white' : 'text-gray-400'
            }`}
          >
            已拥有
          </button>
          <button
            onClick={() => setFilter('notOwned')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === 'notOwned' ? 'bg-amber-500 text-white' : 'text-gray-400'
            }`}
          >
            未拥有
          </button>
        </div>

        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setSort('rarity')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              sort === 'rarity' ? 'bg-amber-500 text-white' : 'text-gray-400'
            }`}
          >
            稀有度
          </button>
          <button
            onClick={() => setSort('mastery')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              sort === 'mastery' ? 'bg-amber-500 text-white' : 'text-gray-400'
            }`}
          >
            掌握度
          </button>
        </div>
      </div>

      {/* 卡牌网格 */}
      <div className="grid grid-cols-3 gap-3">
        {displayCards.map((card) => {
          const isOwned = ownedCardIds.includes(card.id)
          const mastery = masteryMap[card.id] ?? 0

          return (
            <Link
              key={card.id}
              to={`/card/${card.id}`}
              className={`relative rounded-xl overflow-hidden transition-all hover:scale-105 ${
                isOwned ? '' : 'opacity-50 grayscale'
              }`}
            >
              <div className={`bg-gradient-to-b ${getRarityGradient(card.rarity)} p-2 h-32`}>
                {/* 卡牌图片 */}
                <div className="h-16 bg-gray-700/50 rounded-lg flex items-center justify-center text-2xl mb-1">
                  {isOwned ? '📖' : '❓'}
                </div>

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
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          mastery >= level ? 'bg-amber-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* 空状态 */}
      {displayCards.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-4">📭</p>
          <p>没有符合条件的卡牌</p>
        </div>
      )}
    </div>
  )
}
