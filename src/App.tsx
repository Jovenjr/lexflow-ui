import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import ExpedientesPage from './pages/ExpedientesPage'
import ExpedienteDetailPage from './pages/ExpedienteDetailPage'
import ExpedientesLayout from './pages/ExpedientesLayout'
import FacturasPage from './pages/FacturasPage'
import CotizacionesPage from './pages/CotizacionesPage'
import LoginPage from './pages/LoginPage'
import RequireAuth from './components/RequireAuth'
import ClientesPage from './pages/ClientesPage'
import ClienteDetailPage from './pages/ClienteDetailPage'
import AgendaPage from './pages/AgendaPage'

function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-brand-light">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expedientes" element={<ExpedientesLayout />}>
                <Route index element={<ExpedientesPage />} />
                <Route path=":id" element={<ExpedienteDetailPage />} />
              </Route>
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/clientes/nuevo" element={<ClientesPage />} />
              <Route path="/clientes/:id" element={<ClienteDetailPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/facturas/*" element={<FacturasPage />} />
              <Route path="/cotizaciones/*" element={<CotizacionesPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
