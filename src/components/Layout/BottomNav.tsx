import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', label: '港区', icon: '🏠', key: '1' },
  { path: '/gacha', label: '建造', icon: '🎴', key: '2' },
  { path: '/collection', label: '图鉴', icon: '📚', key: '3' },
]

export default function BottomNav() {
  const navigate = useNavigate()

  // PC端键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const item = navItems.find(i => i.key === e.key)
      if (item) {
        navigate(item.path)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-700">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-6 py-2 transition-all ${
                isActive
                  ? 'text-amber-400 scale-110'
                  : 'text-gray-400 hover:text-gray-200 hover:scale-105'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
