interface GachaButtonProps {
  onClick: () => void
  disabled: boolean
  remaining: number
}

export default function GachaButton({ onClick, disabled, remaining }: GachaButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-40 h-40 rounded-full
        flex flex-col items-center justify-center
        text-white font-bold text-xl
        transition-all duration-300
        ${
          disabled
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-br from-amber-500 to-orange-600 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50 active:scale-95'
        }
      `}
    >
      {/* 光晕效果 */}
      {!disabled && (
        <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
      )}

      <span className="text-3xl mb-2">🎴</span>
      <span>建造</span>
      <span className="text-sm mt-1 opacity-80">
        剩余 {remaining} 次
      </span>
    </button>
  )
}
