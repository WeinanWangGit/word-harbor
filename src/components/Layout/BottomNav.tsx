import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: '港区', icon: '🏠' },
  { path: '/gacha', label: '建造', icon: '🎴' },
  { path: '/collection', label: '图鉴', icon: '📚' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-700">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? 'text-amber-400' : 'text-gray-400 hover:text-gray-200'
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
