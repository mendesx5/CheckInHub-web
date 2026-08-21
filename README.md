# CheckInHub Frontend

Frontend mobile-first do **CheckInHub**, uma aplicação para gerenciamento de eventos, inscrições e controle de presença via QR Code.

Dois tipos de usuário:

- **ORGANIZER** — cria e publica eventos, acompanha inscritos e realiza check-in via scanner.
- **PARTICIPANT** — encontra eventos, se inscreve e apresenta seu QR Code na entrada.

## Tecnologias

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Axios
- PWA (`vite-plugin-pwa`)
- Lucide React (ícones)
- `html5-qrcode` (leitura de QR Code pela câmera)
- Sonner (toasts)
- React Hook Form (auxiliar em formulários mais simples)

## Pré-requisitos

- Node.js 18+
- Backend do CheckInHub (Java 21 + Spring Boot) rodando e acessível

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste a URL do backend:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8080
```

Nenhum componente monta URLs manualmente — tudo passa por `src/services/api.ts`.

## Como executar

```bash
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Como conectar ao backend

O backend Spring Boot é a fonte de verdade. Nenhum endpoint foi inventado — apenas os listados abaixo são usados:

```
POST   /users
POST   /events
GET    /events
GET    /events/{eventId}
PUT    /events/publish/{eventId}
DELETE /events/{eventId}
GET    /events/organizer-events/{organizerId}
POST   /enrollments
GET    /enrollments
GET    /enrollments/{enrollmentId}
DELETE /enrollments/{enrollmentId}
GET    /enrollments/{enrollmentId}/qrcode
POST   /check-in
GET    /check-in/event/{eventId}
```

## Modo demonstração

O backend atual ainda não possui Spring Security/JWT nem login. Por isso existe uma tela **Selecionar usuário de demonstração** (`/select-user`), onde você informa manualmente `nome`, `ID` e `perfil` (ORGANIZER ou PARTICIPANT). Essa "sessão" fica isolada em `src/contexts/AuthContext.tsx` e salva provisoriamente em `localStorage` — nenhum outro arquivo lê `localStorage` diretamente.

Quando o backend implementar autenticação real (Spring Security + JWT), apenas este contexto e os services que hoje recebem IDs manualmente (`eventService`, `enrollmentService`, `checkInService`) precisarão mudar. O Axios (`src/services/api.ts`) já está preparado com um interceptor comentado, pronto para anexar `Authorization: Bearer TOKEN`.

## Scanner QR

O organizador acessa `/scanner` (ou `/organizer/events/:eventId/scanner`) para escanear o QR Code do participante:

1. A câmera (preferencialmente traseira) é solicitada via `html5-qrcode`.
2. Ao detectar um QR Code, a leitura é travada (evitando múltiplos envios do mesmo código).
3. O texto lido é enviado como `qrCodeToken` para `POST /check-in`.
4. O resultado (sucesso ou erro) é exibido em tela grande e legível.
5. O organizador libera nova leitura ao tocar em **Escanear próximo**.

O frontend nunca gera QR Codes — eles vêm prontos do backend via `GET /enrollments/{id}/qrcode` (`image/png`).

**Observação sobre HTTPS:** em ambiente publicado, o acesso à câmera em navegadores mobile exige **HTTPS**. `localhost` funciona normalmente durante o desenvolvimento.

## PWA

O projeto está configurado como Progressive Web App (manifest, ícones, `theme_color`, instalação). Não há suporte a funcionamento offline completo — a comunicação com a API sempre depende de internet.

## Estrutura do projeto

```
src/
├── components/
│   ├── common/       # Button, Input, Card, Modal, EmptyState, etc.
│   ├── events/       # EventCard, OrganizerEventCard
│   ├── enrollments/  # EnrollmentCard
│   ├── checkin/      # QRScanner, CheckInResult
│   └── layout/       # PageHeader, BottomNavigation, TopNavigation
├── contexts/
│   └── AuthContext.tsx
├── layouts/
│   └── AppLayout.tsx
├── pages/
│   ├── demo/         # seleção/criação de usuário de teste
│   ├── participant/
│   ├── organizer/
│   └── shared/
├── routes/
│   ├── AppRoutes.tsx
│   ├── RequireUser.tsx
│   └── RoleRoute.tsx   # proteção de rota por perfil (apenas UX, não é segurança real)
├── services/          # isolamento total da API (nenhum componente chama axios direto)
├── types/
└── utils/
```

## Scripts

```bash
npm run dev       # ambiente de desenvolvimento
npm run build     # build de produção (tsc + vite build)
npm run preview   # pré-visualização do build
npm run lint       # oxlint
```

## Próximos passos

- Substituir a filtragem local de inscrições/inscritos por endpoints dedicados quando disponíveis no backend (`// TODO` marcados em `enrollmentService.ts`).
- Implementar autenticação real com Spring Security + JWT.
- Ajustar `src/services/api.ts` para anexar o token JWT automaticamente.
