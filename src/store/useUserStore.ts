import { create } from 'zustand'
import type { UserState, UserActions } from '../types'
import { loadState, saveState, getTodayDateString, defaultUserState } from '../utils/storage'

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>((set, get) => ({
  // 初始状态
  ...defaultUserState,

  // 添加卡牌到收藏，返回是否为新卡
  addCard: (cardId: string) => {
    const state = get()
    const isNew = !state.ownedCardIds.includes(cardId)

    if (isNew) {
      const newState = {
        ...state,
        ownedCardIds: [...state.ownedCardIds, cardId],
        masteryMap: {
          ...state.masteryMap,
          [cardId]: 0,
        },
        newCardIds: [...state.newCardIds, cardId],
        // 如果没有秘书舰，自动设置第一张卡为秘书舰
        secretaryCardId: state.secretaryCardId ?? cardId,
      }
      set(newState)
      saveState(newState)
    }

    return isNew
  },

  // 提升掌握度
  increaseMastery: (cardId: string) => {
    const state = get()
    const currentLevel = state.masteryMap[cardId] ?? 0
    if (currentLevel < 3) {
      const newState = {
        ...state,
        masteryMap: {
          ...state.masteryMap,
          [cardId]: currentLevel + 1,
        },
      }
      set(newState)
      saveState(newState)
    }
  },

  // 消耗一次抽卡次数（优先消耗奖励次数）
  consumeGacha: () => {
    const state = get()
    let newState: UserState

    if (state.bonusGacha > 0) {
      newState = {
        ...state,
        bonusGacha: state.bonusGacha - 1,
      }
    } else if (state.dailyGachaRemaining > 0) {
      newState = {
        ...state,
        dailyGachaRemaining: state.dailyGachaRemaining - 1,
      }
    } else {
      return
    }

    set(newState)
    saveState(newState)
  },

  // 检查并重置每日数据
  resetDailyGachaIfNeeded: () => {
    const state = get()
    const today = getTodayDateString()

    if (state.lastLoginDate !== today) {
      const newState = {
        ...state,
        dailyGachaRemaining: 3,
        lastLoginDate: today,
        dailyReviewDone: false,
        bonusGacha: 0,
      }
      set(newState)
      saveState(newState)
    }
  },

  // 从 localStorage 初始化状态
  initializeFromStorage: () => {
    const savedState = loadState()
    // 合并默认值，确保新字段有默认值
    const mergedState = { ...defaultUserState, ...savedState }
    set(mergedState)

    // 检查是否需要重置每日数据
    const today = getTodayDateString()
    if (mergedState.lastLoginDate !== today) {
      const newState = {
        ...mergedState,
        dailyGachaRemaining: 3,
        lastLoginDate: today,
        dailyReviewDone: false,
        bonusGacha: 0,
        newCardIds: [], // 新会话清空
      }
      set(newState)
      saveState(newState)
    }
  },

  // 更新保底计数
  updatePityCount: (gotHighRarity: boolean) => {
    const state = get()
    const newState = {
      ...state,
      pityCount: gotHighRarity ? 0 : state.pityCount + 1,
    }
    set(newState)
    saveState(newState)
  },

  // 设置秘书舰
  setSecretaryCard: (cardId: string | null) => {
    const state = get()
    const newState = {
      ...state,
      secretaryCardId: cardId,
    }
    set(newState)
    saveState(newState)
  },

  // 完成每日复习
  completeDailyReview: () => {
    const state = get()
    const newState = {
      ...state,
      dailyReviewDone: true,
    }
    set(newState)
    saveState(newState)
  },

  // 添加奖励抽卡次数
  addBonusGacha: (count: number) => {
    const state = get()
    const newState = {
      ...state,
      bonusGacha: state.bonusGacha + count,
    }
    set(newState)
    saveState(newState)
  },

  // 清空新卡牌ID列表
  clearNewCardIds: () => {
    const state = get()
    const newState = {
      ...state,
      newCardIds: [],
    }
    set(newState)
    saveState(newState)
  },
}))

// 获取总抽卡次数（每日+奖励）
export const getTotalGachaRemaining = (state: UserState) => {
  return state.dailyGachaRemaining + state.bonusGacha
}
