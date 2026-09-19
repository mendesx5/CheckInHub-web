# CheckInHub Frontend

Frontend mobile-first do **CheckInHub**, uma aplicação para gerenciamento de eventos, inscrições e controle de presença via QR Code.

Dois tipos de usuário:

- **ORGANIZER** — cria e publica eventos, acompanha inscritos e realiza check-in via scanner.
- **PARTICIPANT** — encontra eventos, se inscreve e apresenta seu QR Code na entrada.

> **Status:** integrado com o backend real (Java 21 + Spring Boot + Spring Security/JWT). Autenticação, autorização por papel e todos os endpoints abaixo já refletem o backend em produção — nada aqui é mockado.

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
- Vitest + Testing Library (testes)

## Pré-requisitos

- Node.js 20+
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

## Autenticação

O login é real, contra o backend: `POST /auth/login` recebe `email`/`password` e retorna um JWT + os dados do usuário. O token é guardado em `localStorage` (`src/services/authStorage.ts`) e anexado automaticamente em toda requisição via interceptor do Axios (`src/services/api.ts`). Uma resposta `401` limpa a sessão e redireciona para `/login`.

A tela em `/login` (`src/pages/demo/SelectUserPage.tsx`) é um formulário de e-mail/senha normal — o nome do arquivo é herdado de uma versão anterior do projeto (quando o backend ainda não tinha login) e pode ser renomeado numa limpeza futura, mas o comportamento já é 100% autenticação real.

A proteção de rota por papel (`src/routes/RoleRoute.tsx`) é só uma conveniência de navegação/UX — a autorização de verdade é sempre validada pelo backend via Spring Security.

## Como conectar ao backend

O backend Spring Boot é a fonte de verdade. Nenhum endpoint foi inventado — apenas os listados abaixo são usados, e cada um já reflete o papel exigido pelo backend:

```
POST   /auth/login                      (público)

POST   /users                           (público — cadastro)

GET    /events                          (autenticado)
GET    /events/{eventId}                (autenticado)
POST   /events                          (ORGANIZER)
PUT    /events/publish/{eventId}        (ORGANIZER)
DELETE /events/{eventId}                (ORGANIZER)
GET    /events/my-events                (ORGANIZER)

POST   /enrollments                     (PARTICIPANT)
GET    /enrollments/{enrollmentId}      (autenticado)
GET    /enrollments/me                  (PARTICIPANT)
GET    /enrollments/event/{eventId}     (ORGANIZER)
DELETE /enrollments/{enrollmentId}      (PARTICIPANT)
GET    /enrollments/{enrollmentId}/qrcode  (PARTICIPANT)

POST   /check-in                        (ORGANIZER)
GET    /check-in/event/{eventId}        (ORGANIZER)
```

## Scanner QR

O organizador acessa `/scanner` (ou `/organizer/events/:eventId/scanner`) para escanear o QR Code do participante:

1. A câmera (preferencialmente traseira) é solicitada via `html5-qrcode`.
2. Ao detectar um QR Code, a leitura é travada (evitando múltiplos envios do mesmo código).
3. O texto lido é enviado como `qrCodeToken` para `POST /check-in`.
4. O resultado (sucesso ou erro) é exibido em tela grande e legível.
5. O organizador libera nova leitura ao tocar em **Escanear próximo**.

O frontend nunca gera QR Codes — eles vêm prontos do backend via `GET /enrollments/{id}/qrcode` (`image/png`).

**Observação sobre HTTPS:** em ambiente publicado, o acesso à câmera em navegadores mobile exige **HTTPS**. `localhost` funciona normalmente durante o desenvolvimento, e a Vercel já serve tudo em HTTPS por padrão.

## PWA

O projeto está configurado como Progressive Web App (manifest, ícones, `theme_color`, instalação). Não há suporte a funcionamento offline completo — a comunicação com a API sempre depende de internet.

## Testes

```bash
npm run test         # roda a suíte uma vez (usado no CI)
npm run test:watch   # modo watch, útil durante o desenvolvimento
```

A suíte usa Vitest + Testing Library, com ambiente `jsdom` (config em `vitest.config.ts`, setup em `src/test/setup.ts`). Cobertura atual:

- `src/utils/apiError.test.ts` — extração de mensagem de erro a partir do formato real de `ApiError` do backend.
- `src/contexts/AuthContext.test.tsx` — fluxo de login (sucesso e falha) e logout, com `authService`/`authStorage` mockados.

Arquivos de teste (`*.test.ts(x)` e `src/test/**`) ficam fora do `tsc -b` de produção (ver `tsconfig.app.json`), então não afetam o build final — eles rodam só via Vitest.

## CI/CD

`.github/workflows/ci.yml` roda em todo push/PR para `main`: instala dependências, lint (`oxlint`), testes (`vitest run`) e build de produção (`tsc -b && vite build`). Um push com lint, teste ou build quebrado falha o pipeline antes de chegar à Vercel.

## Deploy (Vercel)

1. Importe o repositório `CheckInHub-web` na Vercel — o framework Vite é detectado automaticamente (`npm run build`, saída em `dist/`).
2. Configure a variável de ambiente `VITE_API_URL` no painel do projeto (Settings → Environment Variables), apontando para a URL pública do backend.
3. `vercel.json` já inclui um rewrite de SPA (`/(.*) → /index.html`), necessário para as rotas do React Router funcionarem em acesso direto/refresh (sem isso, `/events/42` recarregado dá 404).
4. Faça o deploy. Como o app é PWA, o primeiro acesso em produção já vem com manifest e ícones configurados.

> **Importante:** o backend hoje só libera CORS para `http://localhost:5173` (`SecurityConfig.corsConfigurationSource`). Antes do deploy funcionar de ponta a ponta, o domínio da Vercel (ex.: `https://checkinhub-web.vercel.app`) precisa ser adicionado à lista de `allowedOrigins` no backend — isso é uma mudança no `CheckInHub-api`, não neste repositório.

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
│   ├── demo/         # telas de login/cadastro (nome legado, login já é real)
│   ├── participant/
│   ├── organizer/
│   └── shared/
├── routes/
│   ├── AppRoutes.tsx
│   ├── RequireUser.tsx
│   └── RoleRoute.tsx   # proteção de rota por perfil (UX — a segurança real é do backend)
├── services/          # isolamento total da API (nenhum componente chama axios direto)
├── test/              # setup do Vitest
├── types/
└── utils/
```

## Scripts

```bash
npm run dev         # ambiente de desenvolvimento
npm run build       # build de produção (tsc + vite build)
npm run preview     # pré-visualização do build
npm run lint        # oxlint
npm run test        # testes (Vitest)
npm run test:watch  # testes em modo watch
```

## Próximos passos

- Liberar o domínio de produção (Vercel) no CORS do backend.
- Renomear `src/pages/demo/` para algo como `src/pages/auth/`, já que o fluxo não é mais demonstração.
- Ampliar a cobertura de testes para os services (`eventService`, `enrollmentService`, `checkInService`) com mocks de Axios.
