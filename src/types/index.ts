// 单词卡牌数据
export interface Card {
  id: string
  word: string
  rarity: 1 | 2 | 3 | 4
  description: string
  examples: string[]
  image: string
  audio?: string
}

// 互动题类型
export interface QuizOption {
  text: string
  isCorrect: boolean
}

export interface Quiz {
  question: string
  options: QuizOption[]
}

// 用户状态
export interface UserState {
  ownedCardIds: string[]
  masteryMap: Record<string, number>
  dailyGachaRemaining: number
  lastLoginDate: string
}

// Store Actions
export interface UserActions {
  addCard: (cardId: string) => void
  increaseMastery: (cardId: string) => void
  consumeGacha: () => void
  resetDailyGachaIfNeeded: () => void
  initializeFromStorage: () => void
}
