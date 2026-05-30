import { BrowserRouter } from 'react-router-dom'
import { GameProvider } from './contexts/GameContext'
import AppRoutes from './routes/AppRoutes'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </BrowserRouter>
  )
}

export default App
