import { Link } from 'react-router-dom'
import type { Card } from '../../types'
import { getRarityStars, getRarityColor, getRarityGradient } from '../../utils/gacha'

interface CardViewProps {
  card: Card
  showLink?: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function CardView({ card, showLink = true, size = 'medium' }: CardViewProps) {
  const sizeClasses = {
    small: 'w-24 h-32',
    medium: 'w-36 h-48',
    large: 'w-48 h-64',
  }

  const content = (
    <div
      className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-gradient-to-b ${getRarityGradient(card.rarity)}
        border-2 border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105`}
    >
      <div className="h-3/5 bg-gray-700/50 flex items-center justify-center text-4xl">
        {/* 占位图标 - 实际项目应替换为真实图片 */}
        📖
      </div>
      <div className="h-2/5 p-2 flex flex-col justify-between">
        <div className="text-center">
          <p className={`text-xs ${getRarityColor(card.rarity)}`}>
            {getRarityStars(card.rarity)}
          </p>
          <p className="text-sm font-bold truncate">{card.word}</p>
        </div>
      </div>
    </div>
  )

  if (showLink) {
    return <Link to={`/card/${card.id}`}>{content}</Link>
  }

  return content
}
