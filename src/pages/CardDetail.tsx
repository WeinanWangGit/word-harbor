import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCardById, quizzes } from '../data/cards'
import { useUserStore } from '../store/useUserStore'
import { getRarityStars, getRarityColor, getRarityGradient } from '../utils/gacha'

export default function CardDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { masteryMap, increaseMastery, ownedCardIds } = useUserStore()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const card = id ? getCardById(id) : undefined
  const quiz = id ? quizzes[id] : undefined
  const mastery = id ? masteryMap[id] ?? 0 : 0
  const isOwned = id ? ownedCardIds.includes(id) : false

  useEffect(() => {
    setSelectedAnswer(null)
    setAnswered(false)
    setIsCorrect(false)
  }, [id])

  if (!card) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <p className="text-gray-400">未找到该卡牌</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          返回
        </button>
      </div>
    )
  }

  const handleAnswer = (index: number) => {
    if (answered) return

    setSelectedAnswer(index)
    setAnswered(true)

    const correct = quiz?.options[index]?.isCorrect ?? false
    setIsCorrect(correct)

    if (correct && mastery < 3) {
      increaseMastery(card.id)
    }
  }

  const getMasteryLabel = (level: number) => {
    switch (level) {
      case 0: return '未互动'
      case 1: return '熟悉'
      case 2: return '掌握'
      case 3: return '自然使用'
      default: return '未知'
    }
  }

  return (
    <motion.div
      className="flex-1 p-4 lg:p-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 返回按钮 */}
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        whileHover={{ x: -3 }}
      >
        <span>←</span>
        <span>返回</span>
      </motion.button>

      {/* 卡牌展示区 */}
      <motion.div
        className={`bg-gradient-to-b ${getRarityGradient(card.rarity)} rounded-2xl p-6 mb-6 relative overflow-hidden`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* 背景装饰 */}
        {card.rarity >= 3 && (
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${
                card.rarity === 4 ? '#A855F7' : '#60A5FA'
              } 0%, transparent 60%)`,
            }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* 稀有度和掌握度 */}
        <div className="flex justify-between items-center mb-4 relative">
          <span className={`text-lg ${getRarityColor(card.rarity)}`}>
            {getRarityStars(card.rarity)}
          </span>
          {isOwned && (
            <motion.span
              className="px-3 py-1 bg-black/30 rounded-full text-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {getMasteryLabel(mastery)}
            </motion.span>
          )}
        </div>

        {/* 卡牌图片 */}
        <motion.div
          className="w-40 h-52 mx-auto bg-gray-700/50 rounded-xl flex items-center justify-center text-7xl mb-4 relative"
          whileHover={{ scale: 1.05, rotateY: 5 }}
          transition={{ type: 'spring' }}
        >
          📖
        </motion.div>

        {/* 单词 */}
        <h1 className="text-3xl font-bold text-center mb-2 relative">{card.word}</h1>

        {/* 描述 */}
        <p className="text-gray-300 text-center relative">{card.description}</p>

        {/* 掌握度指示器 */}
        {isOwned && (
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((level) => (
              <motion.div
                key={level}
                className={`w-4 h-4 rounded-full ${
                  mastery >= level ? 'bg-amber-400' : 'bg-gray-600'
                }`}
                animate={
                  mastery >= 3 && mastery >= level
                    ? { boxShadow: ['0 0 5px #FBBF24', '0 0 15px #FBBF24', '0 0 5px #FBBF24'] }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* 例句区 */}
      <motion.div
        className="bg-gray-800/50 rounded-xl p-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm text-gray-400 mb-3">情境例句</h3>
        {card.examples.map((example, index) => (
          <motion.p
            key={index}
            className="text-gray-200 italic mb-2 pl-3 border-l-2 border-amber-500/50"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            "{example}"
          </motion.p>
        ))}
      </motion.div>

      {/* 互动题区 */}
      {quiz && isOwned && (
        <motion.div
          className="bg-gray-800/50 rounded-xl p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm text-gray-400 mb-3">
            互动练习
            {mastery >= 3 && (
              <motion.span
                className="ml-2 text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✓ 已完成
              </motion.span>
            )}
          </h3>

          <p className="text-white mb-4">{quiz.question}</p>

          <div className="space-y-3">
            {quiz.options.map((option, index) => {
              let buttonClass = 'bg-gray-700 hover:bg-gray-600'
              let icon = null

              if (answered) {
                if (option.isCorrect) {
                  buttonClass = 'bg-green-600'
                  icon = '✓'
                } else if (selectedAnswer === index) {
                  buttonClass = 'bg-red-600'
                  icon = '✗'
                } else {
                  buttonClass = 'bg-gray-700 opacity-50'
                }
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`w-full py-3 px-4 rounded-lg text-left transition-colors flex justify-between items-center ${buttonClass}`}
                  whileHover={answered ? {} : { scale: 1.02 }}
                  whileTap={answered ? {} : { scale: 0.98 }}
                >
                  <span>{option.text}</span>
                  {icon && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl"
                    >
                      {icon}
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {answered && (
            <motion.div
              className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                {isCorrect
                  ? mastery < 3
                    ? '正确！掌握度 +1'
                    : '正确！你已经完全掌握了这个表达'
                  : '再想想吧，多看看例句'}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 未拥有提示 */}
      {!isOwned && (
        <motion.div
          className="bg-gray-800/50 rounded-xl p-4 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-400">抽到这张卡牌后可以进行互动练习</p>
        </motion.div>
      )}
    </motion.div>
  )
}
