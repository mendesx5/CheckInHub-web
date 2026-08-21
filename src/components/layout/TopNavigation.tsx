import { NavLink } from 'react-router-dom'
import { Calendar, Ticket, User, LayoutGrid, ScanLine, QrCode } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const participantItems = [
  { to: '/events', label: 'Eventos', icon: Calendar },
  { to: '/my-enrollments', label: 'Minhas inscrições', icon: Ticket },
]

const organizerItems = [
  { to: '/organizer', label: 'Painel', icon: LayoutGrid },
  { to: '/organizer/events', label: 'Meus eventos', icon: Calendar },
  { to: '/scanner', label: 'Scanner', icon: ScanLine },
]

export default function TopNavigation() {
  const { currentUser } = useAuth()
  if (!currentUser) return null

  const items = currentUser.role === 'ORGANIZER' ? organizerItems : participantItems

  return (
    <header className="safe-top sticky top-0 z-30 hidden border-b border-ink-100 bg-white/90 backdrop-blur sm:block">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2 font-semibold text-ink-900">
          <QrCode className="size-5 text-brand-600" aria-hidden />
          CheckInHub
        </div>
        <nav aria-label="Navegação principal" className="flex items-center gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/organizer'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-50'
                }`
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `ml-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-50'
              }`
            }
          >
            <User className="size-4" aria-hidden />
            Perfil
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
