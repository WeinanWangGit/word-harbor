import { create } from 'zustand'
import type { UserState, UserActions } from '../types'
import { loadState, saveState, getTodayDateString, defaultUserState } from '../utils/storage'

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>((set, get) => ({
  // 初始状态
  ...defaultUserState,

  // 添加卡牌到收藏
  addCard: (cardId: string) => {
    const state = get()
    if (!state.ownedCardIds.includes(cardId)) {
      const newState = {
        ...state,
        ownedCardIds: [...state.ownedCardIds, cardId],
        masteryMap: {
          ...state.masteryMap,
          [cardId]: state.masteryMap[cardId] ?? 0,
        },
      }
      set(newState)
      saveState(newState)
    }
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

  // 消耗一次抽卡次数
  consumeGacha: () => {
    const state = get()
    if (state.dailyGachaRemaining > 0) {
      const newState = {
        ...state,
        dailyGachaRemaining: state.dailyGachaRemaining - 1,
      }
      set(newState)
      saveState(newState)
    }
  },

  // 检查并重置每日抽卡次数
  resetDailyGachaIfNeeded: () => {
    const state = get()
    const today = getTodayDateString()

    if (state.lastLoginDate !== today) {
      const newState = {
        ...state,
        dailyGachaRemaining: 3,
        lastLoginDate: today,
      }
      set(newState)
      saveState(newState)
    }
  },

  // 从 localStorage 初始化状态
  initializeFromStorage: () => {
    const savedState = loadState()
    set(savedState)

    // 检查是否需要重置每日抽卡
    const today = getTodayDateString()
    if (savedState.lastLoginDate !== today) {
      const newState = {
        ...savedState,
        dailyGachaRemaining: 3,
        lastLoginDate: today,
      }
      set(newState)
      saveState(newState)
    }
  },
}))
