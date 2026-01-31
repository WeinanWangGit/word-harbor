import { useState, useEffect, useCallback } from 'react'
import type { Card } from '../types'
import { useUserStore, getTotalGachaRemaining } from '../store/useUserStore'
import { performGachaWithPity } from '../utils/gacha'
import GachaButton from '../components/Gacha/GachaButton'
import GachaAnimation from '../components/Gacha/GachaAnimation'
import ResultModal from '../components/Modal/ResultModal'

export default function Gacha() {
  const {
    dailyGachaRemaining,
    bonusGacha,
    pityCount,
    masteryMap,
    consumeGacha,
    addCard,
    increaseMastery,
    updatePityCount,
    initializeFromStorage,
  } = useUserStore()

  const [isAnimating, setIsAnimating] = useState(false)
  const [resultCard, setResultCard] = useState<Card | null>(null)
  const [cardRarity, setCardRarity] = useState(1)
  const [showResult, setShowResult] = useState(false)
  const [isNewCard, setIsNewCard] = useState(false)
  const [currentMastery, setCurrentMastery] = useState(0)

  const totalRemaining = getTotalGachaRemaining({ dailyGachaRemaining, bonusGacha } as any)

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  const handleGacha = () => {
    if (totalRemaining <= 0 || isAnimating) return

    // 执行抽卡（带保底）
    const { card, isHighRarity } = performGachaWithPity(pityCount)

    // 保存卡牌信息用于动画
    setResultCard(card)
    setCardRarity(card.rarity)

    // 消耗次数
    consumeGacha()

    // 更新保底计数
    updatePityCount(isHighRarity)

    // 开始动画
    setIsAnimating(true)
  }

  const handleAnimationComplete = useCallback(() => {
    if (!resultCard) return

    // 检查是否为新卡
    const isNew = addCard(resultCard.id)
    setIsNewCard(isNew)

    // 获取当前掌握度
    const mastery = masteryMap[resultCard.id] ?? 0
    setCurrentMastery(mastery)

    // 如果是重复卡牌且未满级，提升掌握度
    if (!isNew && mastery < 3) {
      increaseMastery(resultCard.id)
    }

    // 停止动画，显示结果
    setIsAnimating(false)
    setShowResult(true)
  }, [resultCard, addCard, masteryMap, increaseMastery])

  const handleCloseResult = () => {
    setShowResult(false)
    setResultCard(null)
  }

  return (
    <div className="flex-1 p-4 flex flex-col items-center justify-center">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          建造
        </h1>
        <p className="text-gray-400 text-sm mt-1">抽取新的单词伙伴</p>
      </div>

      {/* 抽卡按钮 */}
      <GachaButton
        onClick={handleGacha}
        disabled={totalRemaining <= 0 || isAnimating}
        remaining={dailyGachaRemaining}
        bonusCount={bonusGacha}
      />

      {/* 提示信息 */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        {totalRemaining <= 0 ? (
          <p>今日抽卡次数已用完，明天再来吧！</p>
        ) : (
          <p>点击按钮开始建造</p>
        )}
      </div>

      {/* 保底进度 */}
      <div className="mt-4 w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>保底进度</span>
          <span>{pityCount} / 10</span>
        </div>
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(pityCount / 10) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          {pityCount >= 9 ? '下次必出 3★ 以上！' : `还差 ${10 - pityCount} 次保底`}
        </p>
      </div>

      {/* 稀有度概率说明 */}
      <div className="mt-6 bg-gray-800/50 rounded-xl p-4 w-full max-w-xs">
        <p className="text-center text-sm text-gray-400 mb-2">出现概率</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-300">★</span>
            <span className="text-gray-400">60%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-400">★★</span>
            <span className="text-gray-400">25%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-400">★★★</span>
            <span className="text-gray-400">10%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">★★★★</span>
            <span className="text-gray-400">5%</span>
          </div>
        </div>
      </div>

      {/* 动画层 */}
      <GachaAnimation
        isPlaying={isAnimating}
        rarity={cardRarity}
        onComplete={handleAnimationComplete}
      />

      {/* 结果弹层 */}
      <ResultModal
        card={resultCard}
        isOpen={showResult}
        isNew={isNewCard}
        currentMastery={currentMastery}
        onClose={handleCloseResult}
      />
    </div>
  )
}
