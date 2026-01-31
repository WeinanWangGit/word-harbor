import type { UserState } from '../types'

const STORAGE_KEY = 'word-harbor-user'

// 默认用户状态
export const defaultUserState: UserState = {
  ownedCardIds: [],
  masteryMap: {},
  dailyGachaRemaining: 3,
  lastLoginDate: '',
}

// 从 localStorage 加载状态
export function loadState(): UserState {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data) as UserState
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
  }
  return defaultUserState
}

// 保存状态到 localStorage
export function saveState(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
  }
}

// 获取今天的日期字符串
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}
