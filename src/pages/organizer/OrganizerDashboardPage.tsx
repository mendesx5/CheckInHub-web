import { Link } from 'react-router-dom'
import { LayoutGrid, PlusCircle, ScanLine } from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/common/Card'
import { useAuth } from '../../contexts/AuthContext'

const quickLinks = [
  { to: '/organizer/events', label: 'Meus eventos', icon: LayoutGrid },
  { to: '/organizer/events/new', label: 'Criar evento', icon: PlusCircle },
  { to: '/scanner', label: 'Abrir scanner', icon: ScanLine },
]

export default function OrganizerDashboardPage() {
  const { currentUser } = useAuth()

  return (
    <div>
      <PageHeader title="Painel" />

      <div className="rounded-2xl bg-brand-600 px-5 py-6 text-white">
        <p className="text-lg font-semibold">Olá, {currentUser?.name}</p>
        <p className="mt-1 text-[15px] opacity-90">Gerencie seus eventos e acompanhe os check-ins.</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {quickLinks.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="flex items-center gap-3 hover:shadow-[0_2px_10px_rgba(20,18,31,0.08)]">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="size-5" aria-hidden />
              </div>
              <span className="text-[15px] font-medium text-ink-900">{label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
