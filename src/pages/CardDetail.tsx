import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
    // 重置答题状态
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
      case 0:
        return '未互动'
      case 1:
        return '熟悉'
      case 2:
        return '掌握'
      case 3:
        return '自然使用'
      default:
        return '未知'
    }
  }

  return (
    <div className="flex-1 p-4 pb-20">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-400 hover:text-white transition-colors"
      >
        ← 返回
      </button>

      {/* 卡牌展示区 */}
      <div className={`bg-gradient-to-b ${getRarityGradient(card.rarity)} rounded-2xl p-6 mb-6`}>
        {/* 稀有度和掌握度 */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-lg ${getRarityColor(card.rarity)}`}>
            {getRarityStars(card.rarity)}
          </span>
          {isOwned && (
            <span className="px-3 py-1 bg-black/30 rounded-full text-sm">
              {getMasteryLabel(mastery)}
            </span>
          )}
        </div>

        {/* 卡牌图片 */}
        <div className="w-40 h-52 mx-auto bg-gray-700/50 rounded-xl flex items-center justify-center text-7xl mb-4">
          📖
        </div>

        {/* 单词 */}
        <h1 className="text-3xl font-bold text-center mb-2">{card.word}</h1>

        {/* 描述 */}
        <p className="text-gray-300 text-center">{card.description}</p>
      </div>

      {/* 例句区 */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
        <h3 className="text-sm text-gray-400 mb-3">情境例句</h3>
        {card.examples.map((example, index) => (
          <p key={index} className="text-gray-200 italic mb-2">
            "{example}"
          </p>
        ))}
      </div>

      {/* 互动题区 */}
      {quiz && isOwned && (
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h3 className="text-sm text-gray-400 mb-3">
            互动练习
            {mastery >= 3 && <span className="ml-2 text-green-400">已完成</span>}
          </h3>

          <p className="text-white mb-4">{quiz.question}</p>

          <div className="space-y-3">
            {quiz.options.map((option, index) => {
              let buttonClass = 'bg-gray-700 hover:bg-gray-600'

              if (answered) {
                if (option.isCorrect) {
                  buttonClass = 'bg-green-600'
                } else if (selectedAnswer === index) {
                  buttonClass = 'bg-red-600'
                } else {
                  buttonClass = 'bg-gray-700 opacity-50'
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${buttonClass}`}
                >
                  {option.text}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              <p className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                {isCorrect
                  ? mastery < 3
                    ? '正确！掌握度 +1'
                    : '正确！你已经完全掌握了这个表达'
                  : '再想想吧，多看看例句'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 未拥有提示 */}
      {!isOwned && (
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-gray-400">抽到这张卡牌后可以进行互动练习</p>
        </div>
      )}
    </div>
  )
}
