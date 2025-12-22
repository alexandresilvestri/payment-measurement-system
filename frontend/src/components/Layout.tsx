import React from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import {
  LayoutDashboard,
  FileText,
  LogOut,
  User as UserIcon,
  ScrollText,
  HardHat,
  ClipboardCheck,
  Users,
} from 'lucide-react'

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser, logout } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

  if (!currentUser) return <>{children}</>

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isDirector = currentUser.role === 'DIRETOR'

  return (
    <div className="flex min-h-screen bg-bgMain font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="text-xl font-bold text-textMain tracking-tight">
              CONFERIR
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-2 py-2 text-xs font-semibold text-textSec uppercase tracking-wider">
            Menu Principal
          </div>

          <Link
            to={isDirector ? '/director' : '/site'}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname === (isDirector ? '/director' : '/site')
                ? 'bg-surfaceHighlight text-primary'
                : 'text-textSec hover:bg-gray-50 hover:text-textMain'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/works"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/works')
                ? 'bg-surfaceHighlight text-primary'
                : 'text-textSec hover:bg-gray-50 hover:text-textMain'
            }`}
          >
            <HardHat className="w-5 h-5" />
            Obras
          </Link>

          <Link
            to="/suppliers"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/suppliers')
                ? 'bg-surfaceHighlight text-primary'
                : 'text-textSec hover:bg-gray-50 hover:text-textMain'
            }`}
          >
            <Users className="w-5 h-5" />
            Fornecedores
          </Link>

          <Link
            to="/new-contract"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/new-contract')
                ? 'bg-surfaceHighlight text-primary'
                : 'text-textSec hover:bg-gray-50 hover:text-textMain'
            }`}
          >
            <ScrollText className="w-5 h-5" />
            Novo Contrato
          </Link>

          <Link
            to="/new-measurement"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/new-measurement')
                ? 'bg-surfaceHighlight text-primary'
                : 'text-textSec hover:bg-gray-50 hover:text-textMain'
            }`}
          >
            <FileText className="w-5 h-5" />
            Nova Medição
          </Link>

          <Link
            to="/realized-measurements"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/realized-measurements')
                ? 'bg-surfaceHighlight text-primary'
                : 'text-textSec hover:bg-gray-50 hover:text-textMain'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            Medições Realizadas
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-surfaceHighlight flex items-center justify-center text-primary border border-secondary">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-textMain truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-textSec truncate">
                {isDirector ? 'Diretoria' : 'Eng. Obra'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-textSec hover:text-statusRejected p-1"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
