import { useState, useEffect } from 'react'
import type { Card } from '../types'
import { useUserStore } from '../store/useUserStore'
import { performGacha } from '../utils/gacha'
import GachaButton from '../components/Gacha/GachaButton'
import GachaAnimation from '../components/Gacha/GachaAnimation'
import ResultModal from '../components/Modal/ResultModal'

export default function Gacha() {
  const { dailyGachaRemaining, consumeGacha, addCard, initializeFromStorage } = useUserStore()

  const [isAnimating, setIsAnimating] = useState(false)
  const [resultCard, setResultCard] = useState<Card | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  const handleGacha = () => {
    if (dailyGachaRemaining <= 0 || isAnimating) return

    // 开始动画
    setIsAnimating(true)

    // 模拟抽卡过程
    setTimeout(() => {
      // 执行抽卡
      const card = performGacha()

      // 消耗次数并添加卡牌
      consumeGacha()
      addCard(card.id)

      // 停止动画，显示结果
      setIsAnimating(false)
      setResultCard(card)
      setShowResult(true)
    }, 1500)
  }

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
        disabled={dailyGachaRemaining <= 0 || isAnimating}
        remaining={dailyGachaRemaining}
      />

      {/* 提示信息 */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        {dailyGachaRemaining <= 0 ? (
          <p>今日抽卡次数已用完，明天再来吧！</p>
        ) : (
          <p>点击按钮开始建造</p>
        )}
      </div>

      {/* 稀有度概率说明 */}
      <div className="mt-8 bg-gray-800/50 rounded-xl p-4 w-full max-w-xs">
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
      <GachaAnimation isPlaying={isAnimating} />

      {/* 结果弹层 */}
      <ResultModal
        card={resultCard}
        isOpen={showResult}
        onClose={handleCloseResult}
      />
    </div>
  )
}
