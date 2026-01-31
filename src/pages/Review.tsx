import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import { getCardById, quizzes } from '../data/cards'
import { getRarityGradient, getRarityStars, getRarityColor } from '../utils/gacha'
import type { Card } from '../types'

export default function Review() {
  const navigate = useNavigate()
  const {
    ownedCardIds,
    dailyReviewDone,
    completeDailyReview,
    addBonusGacha,
    initializeFromStorage,
  } = useUserStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  // 随机选择3张卡牌
  const reviewCards = useMemo(() => {
    if (ownedCardIds.length === 0) return []
    const shuffled = [...ownedCardIds].sort(() => Math.random() - 0.5)
    const selectedIds = shuffled.slice(0, Math.min(3, shuffled.length))
    return selectedIds
      .map((id) => getCardById(id))
      .filter((card): card is Card => card !== undefined)
  }, [ownedCardIds])

  const currentCard = reviewCards[currentIndex]
  const currentQuiz = currentCard ? quizzes[currentCard.id] : null
  const isLastQuestion = currentIndex === reviewCards.length - 1

  // 如果已完成或没有卡牌，重定向
  useEffect(() => {
    if (dailyReviewDone) {
      navigate('/')
    }
  }, [dailyReviewDone, navigate])

  if (reviewCards.length === 0) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <p className="text-gray-400">没有可复习的卡牌</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-gray-700 rounded-lg"
        >
          返回首页
        </button>
      </div>
    )
  }

  const handleAnswer = (index: number) => {
    if (answered) return

    setSelectedAnswer(index)
    setAnswered(true)

    if (currentQuiz?.options[index]?.isCorrect) {
      setCorrectCount((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // 完成复习
      setShowResult(true)
      completeDailyReview()

      // 如果全部答对，奖励1次抽卡
      if (correctCount + (currentQuiz?.options[selectedAnswer ?? -1]?.isCorrect ? 1 : 0) === reviewCards.length) {
        addBonusGacha(1)
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  // 结果页面
  if (showResult) {
    const finalCorrect = correctCount + (currentQuiz?.options[selectedAnswer ?? -1]?.isCorrect ? 1 : 0)
    const allCorrect = finalCorrect === reviewCards.length

    return (
      <motion.div
        className="flex-1 p-4 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <motion.p
            className="text-6xl mb-4"
            animate={allCorrect ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: allCorrect ? 3 : 0 }}
          >
            {allCorrect ? '🎉' : '📝'}
          </motion.p>

          <h2 className="text-2xl font-bold mb-2">复习完成！</h2>

          <p className="text-gray-400 mb-4">
            答对 <span className="text-amber-400 font-bold">{finalCorrect}</span> / {reviewCards.length} 题
          </p>

          {allCorrect && (
            <motion.div
              className="bg-green-900/50 rounded-xl p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-green-400 font-bold">🎁 全部答对！</p>
              <p className="text-green-300 text-sm">获得 1 次额外抽卡机会</p>
            </motion.div>
          )}

          <motion.button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 rounded-xl font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            返回首页
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 p-4 pb-20">
      {/* 进度 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>每日复习</span>
          <span>{currentIndex + 1} / {reviewCards.length}</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / reviewCards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 当前卡牌 */}
      {currentCard && currentQuiz && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* 卡牌展示 */}
            <div className={`bg-gradient-to-b ${getRarityGradient(currentCard.rarity)} rounded-2xl p-4 mb-6`}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-28 bg-gray-700/50 rounded-xl flex items-center justify-center text-4xl">
                  📖
                </div>
                <div>
                  <p className={`text-sm ${getRarityColor(currentCard.rarity)}`}>
                    {getRarityStars(currentCard.rarity)}
                  </p>
                  <h2 className="text-xl font-bold">{currentCard.word}</h2>
                  <p className="text-gray-300 text-sm mt-1">{currentCard.description}</p>
                </div>
              </div>
            </div>

            {/* 问题 */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <p className="text-white font-medium">{currentQuiz.question}</p>
            </div>

            {/* 选项 */}
            <div className="space-y-3 mb-6">
              {currentQuiz.options.map((option, index) => {
                let buttonClass = 'bg-gray-700 hover:bg-gray-600'
                let icon = null

                if (answered) {
                  if (option.isCorrect) {
                    buttonClass = 'bg-green-600'
                    icon = <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl"
                    >✓</motion.span>
                  } else if (selectedAnswer === index) {
                    buttonClass = 'bg-red-600'
                    icon = <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, x: [0, -5, 5, 0] }}
                      className="text-xl"
                    >✗</motion.span>
                  } else {
                    buttonClass = 'bg-gray-700 opacity-50'
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                    className={`w-full py-4 px-4 rounded-xl text-left transition-colors flex items-center justify-between ${buttonClass}`}
                    whileTap={answered ? {} : { scale: 0.98 }}
                  >
                    <span>{option.text}</span>
                    {icon}
                  </motion.button>
                )
              })}
            </div>

            {/* 继续按钮 */}
            {answered && (
              <motion.button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLastQuestion ? '查看结果' : '下一题'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
