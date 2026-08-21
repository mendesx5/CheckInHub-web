import { NavLink } from 'react-router-dom'
import { Calendar, Ticket, User, LayoutGrid, ScanLine } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const participantItems = [
  { to: '/events', label: 'Eventos', icon: Calendar },
  { to: '/my-enrollments', label: 'Inscrições', icon: Ticket },
  { to: '/profile', label: 'Perfil', icon: User },
]

const organizerItems = [
  { to: '/organizer/events', label: 'Meus eventos', icon: LayoutGrid },
  { to: '/scanner', label: 'Scanner', icon: ScanLine },
  { to: '/profile', label: 'Perfil', icon: User },
]

export default function BottomNavigation() {
  const { currentUser } = useAuth()
  if (!currentUser) return null

  const items = currentUser.role === 'ORGANIZER' ? organizerItems : participantItems

  return (
    <nav
      aria-label="Navegação principal"
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/95 backdrop-blur sm:hidden"
    >
      <ul className="flex">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                  isActive ? 'text-brand-600' : 'text-ink-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-5" strokeWidth={isActive ? 2.4 : 2} aria-hidden />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
