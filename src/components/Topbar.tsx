
import { useState } from 'react'
import { FiSun, FiMoon, FiUser, FiDollarSign } from 'react-icons/fi'

function Topbar() {
  const [darkMode, setDarkMode] = useState(true)
  const [currency, setCurrency] = useState('USD')

  return (
    <header className="h-14 bg-brand-dark flex items-center px-6 border-b border-brand-light">
      <div className="ml-auto flex items-center space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-brand-light"
          title="Cambiar tema"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-brand-light p-2 rounded text-sm"
        >
          <option value="USD">USD</option>
          <option value="DOP">DOP</option>
          <option value="EUR">EUR</option>
        </select>

        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded hover:bg-brand-light">
            <FiUser />
            <span>Usuario</span>
          </button>
          {/* future dropdown */}
        </div>
      </div>
    </header>
  )
}

export default Topbar
