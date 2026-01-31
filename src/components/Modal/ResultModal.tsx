import { useNavigate } from 'react-router-dom'
import type { Card } from '../../types'
import { getRarityStars, getRarityColor, getRarityGradient } from '../../utils/gacha'

interface ResultModalProps {
  card: Card | null
  isOpen: boolean
  onClose: () => void
}

export default function ResultModal({ card, isOpen, onClose }: ResultModalProps) {
  const navigate = useNavigate()

  if (!isOpen || !card) return null

  const handleViewDetail = () => {
    onClose()
    navigate(`/card/${card.id}`)
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full mx-4 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 光效背景 */}
        <div className={`absolute inset-0 bg-gradient-to-b ${getRarityGradient(card.rarity)} rounded-2xl blur-xl opacity-50`} />

        {/* 卡牌内容 */}
        <div className={`relative bg-gradient-to-b ${getRarityGradient(card.rarity)} rounded-2xl p-6 border-2 border-white/30`}>
          {/* 稀有度 */}
          <div className="text-center mb-4">
            <span className={`text-2xl ${getRarityColor(card.rarity)}`}>
              {getRarityStars(card.rarity)}
            </span>
          </div>

          {/* 卡牌图片 */}
          <div className="w-32 h-40 mx-auto bg-gray-700/50 rounded-xl flex items-center justify-center text-6xl mb-4">
            📖
          </div>

          {/* 单词 */}
          <h2 className="text-2xl font-bold text-center mb-2">{card.word}</h2>

          {/* 描述 */}
          <p className="text-gray-300 text-center text-sm mb-4">{card.description}</p>

          {/* 例句 */}
          <div className="bg-black/30 rounded-lg p-3 mb-4">
            <p className="text-sm italic text-gray-300">"{card.examples[0]}"</p>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              继续抽卡
            </button>
            <button
              onClick={handleViewDetail}
              className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 transition-colors font-semibold"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
