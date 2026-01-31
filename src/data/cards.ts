import type { Card, Quiz } from '../types'

// 单词卡牌静态数据
export const cards: Card[] = [
  // 1星 - 高频基础词
  {
    id: 'c001',
    word: 'actually',
    rarity: 1,
    description: '用于强调事实，或者纠正别人的误解',
    examples: [
      'Actually, I prefer tea over coffee.',
      "I thought it was hard, but it's actually quite easy.",
    ],
    image: '/images/actually.png',
  },
  {
    id: 'c002',
    word: 'stuff',
    rarity: 1,
    description: '口语中代替"东西、事情"的万能词',
    examples: [
      "I have a lot of stuff to do today.",
      "Where did you put my stuff?",
    ],
    image: '/images/stuff.png',
  },
  {
    id: 'c003',
    word: 'kind of',
    rarity: 1,
    description: '缓和语气，表示"有点、某种程度上"',
    examples: [
      "I'm kind of tired.",
      "It's kind of complicated.",
    ],
    image: '/images/kindof.png',
  },
  // 2星 - 核心表达
  {
    id: 'c004',
    word: 'figure out',
    rarity: 2,
    description: '通过思考来理解或解决某事',
    examples: [
      "I need to figure out how to fix this.",
      "Let me figure out the best way to do it.",
    ],
    image: '/images/figureout.png',
  },
  {
    id: 'c005',
    word: 'end up',
    rarity: 2,
    description: '最终变成某种状态（往往出乎意料）',
    examples: [
      'We ended up staying until midnight.',
      "If you don't study, you'll end up failing.",
    ],
    image: '/images/endup.png',
  },
  {
    id: 'c006',
    word: 'turn out',
    rarity: 2,
    description: '结果证明是...',
    examples: [
      'It turned out to be a great decision.',
      'The party turned out better than expected.',
    ],
    image: '/images/turnout.png',
  },
  // 3星 - 地道/习语
  {
    id: 'c007',
    word: 'no big deal',
    rarity: 3,
    description: '没什么大不了的，用于安慰或表示轻松',
    examples: [
      "Don't worry about it, it's no big deal.",
      'Missing one class is no big deal.',
    ],
    image: '/images/nobigdeal.png',
  },
  {
    id: 'c008',
    word: 'a piece of cake',
    rarity: 3,
    description: '形容某事非常简单',
    examples: [
      'The exam was a piece of cake.',
      "Don't worry, it'll be a piece of cake.",
    ],
    image: '/images/pieceofcake.png',
  },
  {
    id: 'c009',
    word: 'under the weather',
    rarity: 3,
    description: '身体不舒服、有点生病',
    examples: [
      "I'm feeling under the weather today.",
      "She's been under the weather all week.",
    ],
    image: '/images/underweather.png',
  },
  // 4星 - 高级/情绪化表达
  {
    id: 'c010',
    word: 'blown away',
    rarity: 4,
    description: '被深深打动、震撼',
    examples: [
      'I was blown away by the performance.',
      'The view from the top just blew me away.',
    ],
    image: '/images/blownaway.png',
  },
  {
    id: 'c011',
    word: 'on cloud nine',
    rarity: 4,
    description: '欣喜若狂、极度开心',
    examples: [
      "I've been on cloud nine since I got the job offer.",
      'She was on cloud nine after hearing the news.',
    ],
    image: '/images/cloudnine.png',
  },
  {
    id: 'c012',
    word: 'hit the nail on the head',
    rarity: 4,
    description: '说得非常准确、一针见血',
    examples: [
      "You've hit the nail on the head with that analysis.",
      'She really hit the nail on the head about the problem.',
    ],
    image: '/images/nailonhead.png',
  },
]

// 为每张卡牌生成互动题
export const quizzes: Record<string, Quiz> = {
  c001: {
    question: '"Actually" 最适合在什么情况下使用？',
    options: [
      { text: '纠正别人的误解', isCorrect: true },
      { text: '表示未来计划', isCorrect: false },
      { text: '询问别人意见', isCorrect: false },
    ],
  },
  c002: {
    question: '下面哪个句子正确使用了 "stuff"？',
    options: [
      { text: 'I have a lot of stuff to do.', isCorrect: true },
      { text: 'The stuff is very beautiful today.', isCorrect: false },
      { text: 'I stuff my homework yesterday.', isCorrect: false },
    ],
  },
  c003: {
    question: '"kind of" 在口语中表示什么意思？',
    options: [
      { text: '有点、某种程度上', isCorrect: true },
      { text: '一种类型', isCorrect: false },
      { text: '非常、极其', isCorrect: false },
    ],
  },
  c004: {
    question: '"figure out" 的意思是？',
    options: [
      { text: '通过思考理解或解决', isCorrect: true },
      { text: '画出图形', isCorrect: false },
      { text: '走出去', isCorrect: false },
    ],
  },
  c005: {
    question: '哪个句子正确使用了 "end up"？',
    options: [
      { text: 'We ended up staying late.', isCorrect: true },
      { text: 'I end up the book.', isCorrect: false },
      { text: 'The movie end up good.', isCorrect: false },
    ],
  },
  c006: {
    question: '"turn out" 表示什么？',
    options: [
      { text: '结果证明是...', isCorrect: true },
      { text: '转身离开', isCorrect: false },
      { text: '关掉电源', isCorrect: false },
    ],
  },
  c007: {
    question: '当朋友为小错误道歉时，你可以说什么？',
    options: [
      { text: "It's no big deal.", isCorrect: true },
      { text: "It's a big deal.", isCorrect: false },
      { text: "Deal with it.", isCorrect: false },
    ],
  },
  c008: {
    question: '"a piece of cake" 用来形容什么？',
    options: [
      { text: '某事非常简单', isCorrect: true },
      { text: '一块美味的蛋糕', isCorrect: false },
      { text: '一个困难的任务', isCorrect: false },
    ],
  },
  c009: {
    question: '如果你 "feeling under the weather"，你应该怎么办？',
    options: [
      { text: '多休息，因为身体不舒服', isCorrect: true },
      { text: '出门看天气', isCorrect: false },
      { text: '去海边玩', isCorrect: false },
    ],
  },
  c010: {
    question: '"blown away" 表达什么情感？',
    options: [
      { text: '被深深打动、震撼', isCorrect: true },
      { text: '被风吹走', isCorrect: false },
      { text: '感到无聊', isCorrect: false },
    ],
  },
  c011: {
    question: '当你 "on cloud nine" 时，你的心情是？',
    options: [
      { text: '欣喜若狂、极度开心', isCorrect: true },
      { text: '在天上飞', isCorrect: false },
      { text: '感到迷茫', isCorrect: false },
    ],
  },
  c012: {
    question: '"hit the nail on the head" 的意思是？',
    options: [
      { text: '说得非常准确', isCorrect: true },
      { text: '用锤子敲钉子', isCorrect: false },
      { text: '伤害到自己', isCorrect: false },
    ],
  },
}

// 根据ID获取卡牌
export function getCardById(id: string): Card | undefined {
  return cards.find((card) => card.id === id)
}

// 根据稀有度获取卡牌列表
export function getCardsByRarity(rarity: number): Card[] {
  return cards.filter((card) => card.rarity === rarity)
}
