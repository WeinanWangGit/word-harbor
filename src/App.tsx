import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Gacha from './pages/Gacha'
import Collection from './pages/Collection'
import CardDetail from './pages/CardDetail'
import BottomNav from './components/Layout/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gacha" element={<Gacha />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/card/:id" element={<CardDetail />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
