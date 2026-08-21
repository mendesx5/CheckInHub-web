import { useNavigate } from 'react-router-dom'
import { User, LogOut } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import { useAuth } from '../../contexts/AuthContext'

export default function ProfilePage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  if (!currentUser) return null

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <PageHeader title="Perfil" />
      <Card className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <User className="size-8" aria-hidden />
        </div>
        <div>
          <p className="text-lg font-semibold text-ink-900">{currentUser.name}</p>
          <p className="text-sm text-ink-500">{currentUser.email}</p>
        </div>
        <Badge tone="brand">{currentUser.role === 'ORGANIZER' ? 'Organizador' : 'Participante'}</Badge>
      </Card>


      <Button
        variant="secondary"
        fullWidth
        className="mt-6"
        icon={<LogOut className="size-4" />}
        onClick={handleLogout}
      >
        Sair
      </Button>
    </div>
  )
}
