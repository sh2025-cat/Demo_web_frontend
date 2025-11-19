import { Routes, Route } from 'react-router-dom'
import { CatBoard } from '@/components/CatBoard'

function App() {
  return (
    <div className="min-h-screen bg-orange-50/50">
      <Routes>
        <Route path="/" element={<CatBoard />} />
      </Routes>
    </div>
  )
}

export default App
