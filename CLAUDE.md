# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Word Harbor 是一个抽卡式英语单词学习 Web App，灵感来自碧蓝航线。核心玩法：抽卡获得单词角色 → 查看卡牌详情 → 完成互动练习 → 提升掌握度。

## Commands

```bash
npm run dev      # 启动开发服务器 (localhost:5173)
npm run build    # TypeScript 编译 + Vite 生产构建
npm run preview  # 预览生产构建
```

## Tech Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4（使用 @tailwindcss/postcss）
- Zustand 状态管理
- React Router DOM v7
- 纯前端，无后端，数据存储在 localStorage

## Architecture

```
src/
├── pages/           # 页面组件（Home/Gacha/Collection/CardDetail）
├── components/      # 可复用组件
│   ├── Card/        # 卡牌展示
│   ├── Gacha/       # 抽卡按钮和动画
│   ├── Modal/       # 结果弹层
│   └── Layout/      # 底部导航
├── store/           # Zustand store (useUserStore)
├── data/            # 静态数据 (cards.ts - 卡牌和互动题)
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数 (gacha.ts, storage.ts)
```

## Key Concepts

**稀有度系统**: 1-4星，抽卡权重 60%/25%/10%/5%

**掌握度系统**: 0-3级（未互动→熟悉→掌握→自然使用），通过答对互动题提升

**每日重置**: dailyGachaRemaining 每天重置为 3，通过 lastLoginDate 判断

## Data Flow

1. `useUserStore.initializeFromStorage()` - 页面加载时从 localStorage 恢复状态
2. `performGacha()` - 按权重随机稀有度，再从对应卡池随机抽取
3. `addCard()` / `increaseMastery()` - 修改状态并自动 `saveState()` 到 localStorage

## Design Constraints

- 不使用后端/数据库
- 不使用 Redux
- 所有状态修改必须通过 store
- 组件内不直接操作 localStorage
- 组件内不写随机逻辑（统一在 utils/gacha.ts）
