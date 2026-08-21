import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../types/user'

/**
 * Proteção apenas de UX/navegação — NÃO é segurança real.
 * O backend ainda não valida permissões; a proteção real virá com
 * Spring Security no futuro.
 */
export default function RoleRoute({ allow }: { allow: UserRole[] }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (!allow.includes(currentUser.role)) {
    const fallback = currentUser.role === 'ORGANIZER' ? '/organizer' : '/events'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
