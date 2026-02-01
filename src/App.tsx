import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Gacha from './pages/Gacha'
import Collection from './pages/Collection'
import CardDetail from './pages/CardDetail'
import Review from './pages/Review'
import BottomNav from './components/Layout/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      {/* PC端居中容器 */}
      <div className="min-h-screen flex justify-center">
        {/* 左侧装饰区域 - 仅PC可见 */}
        <div className="hidden lg:flex flex-col items-center justify-center w-64 p-8">
          <div className="text-center sticky top-1/2 -translate-y-1/2">
            <div className="text-6xl mb-4">🚢</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Word Harbor
            </h1>
            <p className="text-gray-500 text-sm mt-2">抽卡式英语学习</p>
            <div className="mt-6 text-gray-600 text-xs space-y-1">
              <p>📖 收集单词卡牌</p>
              <p>🎴 每日抽卡</p>
              <p>📝 互动练习</p>
            </div>
          </div>
        </div>

        {/* 主内容区域 - 模拟手机屏幕 */}
        <div className="w-full max-w-md lg:min-h-screen lg:border-x lg:border-gray-800 lg:shadow-2xl lg:shadow-black/50 relative bg-gradient-to-b from-gray-900/50 to-gray-900/30 backdrop-blur-sm">
          <div className="min-h-screen pb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gacha" element={<Gacha />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/card/:id" element={<CardDetail />} />
              <Route path="/review" element={<Review />} />
            </Routes>
            <BottomNav />
          </div>
        </div>

        {/* 右侧装饰区域 - 仅PC可见 */}
        <div className="hidden lg:flex flex-col items-center justify-center w-64 p-8">
          <div className="text-center sticky top-1/2 -translate-y-1/2">
            <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-gray-400 text-sm mb-3">快捷键</p>
              <div className="text-left text-xs space-y-2 text-gray-500">
                <p><kbd className="bg-gray-700 px-2 py-1 rounded">1</kbd> 港区首页</p>
                <p><kbd className="bg-gray-700 px-2 py-1 rounded">2</kbd> 建造抽卡</p>
                <p><kbd className="bg-gray-700 px-2 py-1 rounded">3</kbd> 图鉴收藏</p>
              </div>
            </div>
            <div className="mt-6 text-gray-600 text-xs">
              <p>© 2024 Word Harbor</p>
              <p className="mt-1">Made with ❤️</p>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}
