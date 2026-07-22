import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Painel from './pages/Painel'
import HistoricoPage from './pages/Historico'
import RelatoriosPage from './pages/Relatorios'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="/historico" element={<HistoricoPage />} />
      <Route path="/relatorios" element={<RelatoriosPage />} />
    </Routes>
  )
}
