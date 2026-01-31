import { useEffect, useMemo } from 'react'
import { useUserStore } from '../store/useUserStore'
import { getCardById } from '../data/cards'
import CardView from '../components/Card/CardView'

export default function Home() {
  const { ownedCardIds, dailyGachaRemaining, initializeFromStorage } = useUserStore()

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  // 随机选择最多3张已拥有的卡牌展示
  const displayCards = useMemo(() => {
    if (ownedCardIds.length === 0) return []

    const shuffled = [...ownedCardIds].sort(() => Math.random() - 0.5)
    const selectedIds = shuffled.slice(0, Math.min(3, shuffled.length))

    return selectedIds
      .map((id) => getCardById(id))
      .filter((card): card is NonNullable<typeof card> => card !== undefined)
  }, [ownedCardIds])

  return (
    <div className="flex-1 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Word Harbor
        </h1>
        <p className="text-gray-400 text-sm mt-1">单词港湾</p>
      </div>

      {/* 抽卡次数 */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-center">
        <p className="text-gray-400 text-sm">今日剩余抽卡次数</p>
        <p className="text-4xl font-bold text-amber-400 mt-2">
          {dailyGachaRemaining}
          <span className="text-lg text-gray-500"> / 3</span>
        </p>
      </div>

      {/* 已拥有卡牌展示 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {ownedCardIds.length > 0 ? '港区成员' : '欢迎来到 Word Harbor'}
        </h2>

        {ownedCardIds.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-5xl mb-4">🚢</p>
            <p>你的港区还没有成员</p>
            <p className="text-sm mt-2">去抽卡页面抽取你的第一张卡牌吧！</p>
          </div>
        ) : (
          <div className="flex justify-center gap-4 flex-wrap">
            {displayCards.map((card) => (
              <div key={card.id} className="text-center">
                <CardView card={card} size="medium" />
                <p className="text-xs text-gray-400 mt-2 italic">
                  "{card.examples[0]?.slice(0, 30)}..."
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 收藏统计 */}
      <div className="bg-gray-800/30 rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">已收集</p>
        <p className="text-2xl font-bold">
          <span className="text-amber-400">{ownedCardIds.length}</span>
          <span className="text-gray-500 text-lg"> 张卡牌</span>
        </p>
      </div>
    </div>
  )
}
