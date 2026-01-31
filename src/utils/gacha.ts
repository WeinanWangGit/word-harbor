import type { Card } from '../types'
import { cards, getCardsByRarity } from '../data/cards'

// 稀有度权重配置
const rarityWeights: Record<number, number> = {
  1: 60, // 1星 60%
  2: 25, // 2星 25%
  3: 10, // 3星 10%
  4: 5,  // 4星 5%
}

// 根据权重随机选择稀有度
function rollRarity(): number {
  const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight

  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    random -= weight
    if (random <= 0) {
      return parseInt(rarity)
    }
  }

  return 1 // 默认返回1星
}

// 从指定稀有度的卡池中随机抽取一张
function pickRandomCard(rarity: number): Card {
  const pool = getCardsByRarity(rarity)

  // 如果该稀有度没有卡牌，从所有卡牌中随机选择
  if (pool.length === 0) {
    return cards[Math.floor(Math.random() * cards.length)]
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

// 执行一次抽卡（普通）
export function performGacha(): Card {
  const rarity = rollRarity()
  return pickRandomCard(rarity)
}

// 执行一次抽卡（带保底机制）
export function performGachaWithPity(pityCount: number): { card: Card; isHighRarity: boolean } {
  let rarity: number

  // 保底：连续9次未出3星以上，第10次必出
  if (pityCount >= 9) {
    // 强制从3星及以上抽取
    const highRarityWeights = { 3: 70, 4: 30 }
    const total = 100
    let random = Math.random() * total
    rarity = 3
    for (const [r, weight] of Object.entries(highRarityWeights)) {
      random -= weight
      if (random <= 0) {
        rarity = parseInt(r)
        break
      }
    }
  } else {
    rarity = rollRarity()
  }

  const card = pickRandomCard(rarity)
  const isHighRarity = rarity >= 3

  return { card, isHighRarity }
}

// 获取稀有度对应的颜色
export function getRarityColor(rarity: number): string {
  switch (rarity) {
    case 1:
      return 'text-gray-300'
    case 2:
      return 'text-green-400'
    case 3:
      return 'text-blue-400'
    case 4:
      return 'text-purple-400'
    default:
      return 'text-gray-300'
  }
}

// 获取稀有度对应的背景渐变
export function getRarityGradient(rarity: number): string {
  switch (rarity) {
    case 1:
      return 'from-gray-600 to-gray-800'
    case 2:
      return 'from-green-600 to-green-900'
    case 3:
      return 'from-blue-600 to-blue-900'
    case 4:
      return 'from-purple-600 to-purple-900'
    default:
      return 'from-gray-600 to-gray-800'
  }
}

// 获取稀有度星星显示
export function getRarityStars(rarity: number): string {
  return '★'.repeat(rarity)
}
