import { Outlet } from 'react-router-dom'
import BottomNavigation from '../components/layout/BottomNavigation'
import TopNavigation from '../components/layout/TopNavigation'

export default function AppLayout() {
  return (
    <div className="min-h-full bg-ink-50">
      <TopNavigation />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-4 sm:px-6 sm:pb-10">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}
