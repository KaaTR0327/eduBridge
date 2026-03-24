# EduBridge

EduBridge is a bilingual learning-resource marketplace with a React frontend, Express backend, Prisma ORM, and PostgreSQL database.

## Stack
- `frontend/`: React + Vite
- `backend/`: Express + Prisma
- `database/`: schema notes

## Local Development

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Local URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## Production Plan
- Database: `Render Postgres`
- Backend: `Render Web Service`
- Frontend: `Vercel`

Recommended domains:
- Frontend: `https://edubridge.mn`
- API: `https://api.edubridge.mn`

## Production Environment Variables

### Backend
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN=https://edubridge.mn`

### Frontend
- `VITE_API_BASE_URL=https://api.edubridge.mn/api`

## Render Deployment
This repo includes `render.yaml` for backend service defaults. If you deploy manually in Render:

- Root directory: `backend`
- Build command: `npm install && npm run db:deploy`
- Start command: `npm start`
- Health check path: `/health`

`db:deploy` currently runs:
- `prisma generate`
- `prisma db push`

For the first production launch this is acceptable for this repo's current state. Once the schema stabilizes, switch to Prisma migrations.

## Vercel Deployment
- Import the `frontend` folder as the project root
- Set `VITE_API_BASE_URL`
- Keep `frontend/vercel.json` so React Router routes resolve to `index.html`

## Demo Accounts
- `admin@edubridge.mn` / `123456`
- `nomin@edubridge.mn` / `123456`
- `ariunaa@edubridge.mn` / `123456`

## Notes
- Do not commit real `.env` files
- Use a long random `JWT_SECRET` in production
- Enable Render Postgres backups
- Use paid plans if you need the site to stay online continuously
