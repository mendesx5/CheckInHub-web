import { Routes, Route } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import RoleRoute from './RoleRoute'
import RequireUser from './RequireUser'

import RootRedirect from '../pages/shared/RootRedirect'
import SelectUserPage from '../pages/demo/SelectUserPage'
import CreateUserPage from '../pages/demo/CreateUserPage'
import EventsListPage from '../pages/shared/EventsListPage'
import EventDetailPage from '../pages/shared/EventDetailPage'
import ProfilePage from '../pages/shared/ProfilePage'
import NotFoundPage from '../pages/shared/NotFoundPage'

import MyEnrollmentsPage from '../pages/participant/MyEnrollmentsPage'
import EnrollmentDetailPage from '../pages/participant/EnrollmentDetailPage'

import OrganizerDashboardPage from '../pages/organizer/OrganizerDashboardPage'
import OrganizerEventsPage from '../pages/organizer/OrganizerEventsPage'
import CreateEventPage from '../pages/organizer/CreateEventPage'
import EventParticipantsPage from '../pages/organizer/EventParticipantsPage'
import EventCheckInsPage from '../pages/organizer/EventCheckInsPage'
import ScannerPage from '../pages/organizer/ScannerPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<SelectUserPage />} />
      <Route path="/login/new" element={<CreateUserPage />} />

      <Route element={<RequireUser />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleRoute allow={['PARTICIPANT']} />}>
            <Route path="/my-enrollments" element={<MyEnrollmentsPage />} />
            <Route path="/my-enrollments/:enrollmentId" element={<EnrollmentDetailPage />} />
          </Route>

          <Route element={<RoleRoute allow={['ORGANIZER']} />}>
            <Route path="/organizer" element={<OrganizerDashboardPage />} />
            <Route path="/organizer/events" element={<OrganizerEventsPage />} />
            <Route path="/organizer/events/new" element={<CreateEventPage />} />
            <Route path="/organizer/events/:eventId/participants" element={<EventParticipantsPage />} />
            <Route path="/organizer/events/:eventId/checkins" element={<EventCheckInsPage />} />
            <Route path="/organizer/events/:eventId/scanner" element={<ScannerPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
