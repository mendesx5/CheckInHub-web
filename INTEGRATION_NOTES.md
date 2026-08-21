# CheckInHub Web - JWT integration

This frontend is aligned with the accompanying backend update.

## Main changes
- Real login through `POST /auth/login`.
- JWT stored locally and automatically sent as `Authorization: Bearer <token>`.
- Session stores the authenticated user returned by the backend.
- Enrollment creation sends only `eventId`.
- Check-in creation sends only `qrCodeToken`.
- Event creation no longer sends `organizerId`.
- Organizer events use `GET /events/my-events`.
- Enrollment resource standardized as `/enrollments`.
- Participant enrollments use `GET /enrollments/me`.
- Event participants use `GET /enrollments/event/{eventId}`.
- QR Code uses `GET /enrollments/{id}/qrcode`.
- Event check-ins use `GET /check-in/event/{eventId}`.

## Local run
The API defaults to `http://localhost:8080`. To override it, create a `.env` file based on `.env.example` and set `VITE_API_URL`.

```bash
npm install
npm run dev
```
