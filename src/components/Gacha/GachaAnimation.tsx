interface GachaAnimationProps {
  isPlaying: boolean
}

export default function GachaAnimation({ isPlaying }: GachaAnimationProps) {
  if (!isPlaying) return null

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="text-center">
        {/* 动画效果 */}
        <div className="relative">
          {/* 外圈旋转 */}
          <div className="w-48 h-48 rounded-full border-4 border-amber-400/30 animate-spin" />

          {/* 内圈反向旋转 */}
          <div className="absolute inset-4 rounded-full border-4 border-amber-500/50 animate-[spin_1s_linear_infinite_reverse]" />

          {/* 中心光点 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50" />
          </div>
        </div>

        <p className="mt-8 text-amber-400 text-xl animate-pulse">建造中...</p>
      </div>
    </div>
  )
}
