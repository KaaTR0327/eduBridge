# EduBridge

EduBridge is a bilingual education marketplace built as a monorepo with a React frontend and an Express backend. The current codebase supports public course discovery, creator profiles, role-based authentication, course upload with the first lesson video, category-based filtering, and an admin dashboard.

## Current Stack

- `frontend/`: React 18, Vite, React Router, Tailwind CSS, Three.js
- `backend/`: Express, Prisma, JWT auth, Multer uploads
- `database/`: SQL reference files
- `docs/`: API, roadmap, and system design notes
- Database provider in code: `SQLite`

## What The App Currently Does

- Public homepage with hero/search and category browsing
- Explore page with search, filters, and sorting
- Resource detail pages
- Creator profile pages
- Sign in / sign up flow
- Role-based backend routes for `student`, `instructor`, and `admin`
- Instructor upload flow for creating a course and uploading the first video lesson
- Custom category creation from the upload form
- Admin dashboard and moderation endpoints
- Seeded demo data and demo accounts

## Project Structure

```text
eduBridge/
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ seed.js
│  ├─ src/
│  │  ├─ middleware/
│  │  ├─ routes/
│  │  ├─ utils/
│  │  └─ server.js
│  └─ uploads/
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ lib/
│  │  └─ pages/
│  └─ vite.config.js
├─ database/
├─ docs/
├─ render.yaml
└─ README.md
```

## Local Development

### 1. Backend

```bash
cd backend
npm install
npm run db:setup
npm run dev
```

Backend runs on:

- `http://localhost:4000`
- Health check: `http://localhost:4000/health`
- API root: `http://localhost:4000/api`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:3000`

The Vite dev server proxies:

- `/api` -> `http://localhost:4000`
- `/uploads` -> `http://localhost:4000`

## Environment Variables

### Backend `.env`

The backend currently uses SQLite in local development.

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-me"
CORS_ORIGIN="http://localhost:3000"
PORT=4000
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Database Notes

- Prisma datasource provider is currently `sqlite`
- Local database file is created under `backend/prisma/dev.db`
- `npm run db:setup` runs:
  - `prisma generate`
  - `prisma db push`
  - `prisma/seed.js`

## Demo Accounts

These accounts are created by `backend/prisma/seed.js`:

- `admin@edubridge.mn` / `123456`
- `nomin@edubridge.mn` / `123456`
- `bilguun@edubridge.mn` / `123456`
- `ariunaa@edubridge.mn` / `123456`
- `temuulen@edubridge.mn` / `123456`

## Seeded Categories

The current seed includes these categories:

- `English Language`
- `Mongolian Language`
- `Mathematics`
- `Finance`
- `Forex`
- `Web Development`
- `Design`
- `Data`

## Main Frontend Routes

- `/`
- `/explore`
- `/resources/:slug`
- `/creators/:slug`
- `/upload`
- `/auth`
- `/admin`

## Main Backend Route Groups

- `/api/auth`
- `/api/public`
- `/api/resources`
- `/api/creators`
- `/api/instructor`
- `/api/student`
- `/api/admin`

## Deployment Status

This repository already contains:

- `frontend/vercel.json`
- `render.yaml`

Important: the current Prisma schema uses `sqlite`, so the README should not claim the app is already running on PostgreSQL. If you want real production deployment on Render Postgres later, you will need to:

1. change the Prisma datasource provider to `postgresql`
2. update `DATABASE_URL`
3. run migrations for the new database
4. verify file upload/storage strategy for production

## Useful Commands

### Backend

```bash
npm run dev
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run db:setup
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Notes

- Do not commit real secrets to `.env`
- Uploaded files are served from `backend/uploads`
- The current setup is optimized for local development first
- `docs/` contains additional architecture and API notes
