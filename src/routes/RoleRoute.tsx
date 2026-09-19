import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../types/user'

/**
 * Proteção de UX/navegação (evita mostrar telas erradas e redireciona
 * o usuário para a área certa). A segurança real já é feita pelo
 * backend via Spring Security + JWT (role-based authorization) —
 * esta rota apenas evita uma renderização desnecessária no client.
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
