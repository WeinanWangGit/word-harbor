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
  // 原有字段
  ownedCardIds: string[]
  masteryMap: Record<string, number>
  dailyGachaRemaining: number
  lastLoginDate: string

  // v2 新增字段
  pityCount: number              // 保底计数（连续未出3星以上的次数）
  secretaryCardId: string | null // 秘书舰卡牌ID
  dailyReviewDone: boolean       // 今日复习是否完成
  bonusGacha: number             // 奖励抽卡次数
  newCardIds: string[]           // 本次会话新获得的卡牌ID（用于图鉴点亮动画）
}

// Store Actions
export interface UserActions {
  addCard: (cardId: string) => boolean  // 返回是否为新卡
  increaseMastery: (cardId: string) => void
  consumeGacha: () => void
  resetDailyGachaIfNeeded: () => void
  initializeFromStorage: () => void
  // v2 新增
  updatePityCount: (gotHighRarity: boolean) => void
  setSecretaryCard: (cardId: string | null) => void
  completeDailyReview: () => void
  addBonusGacha: (count: number) => void
  clearNewCardIds: () => void
}
