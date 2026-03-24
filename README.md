# EduBridge

Admin-controlled multi-instructor video course marketplace.

## What is included
- `docs/system-design.md`: product and architecture spec
- `docs/api-endpoints.md`: MVP API surface
- `docs/roadmap.md`: delivery phases
- `database/schema.sql`: normalized SQL schema for the platform
- `backend/`: Express + Prisma API with JWT auth, SQLite persistence, and real CRUD
- `frontend/`: dashboard-style UI that visualizes the platform roles, modules, workflows, and metrics

## Core platform model
- `Student`: browses, buys, learns, tracks progress, leaves reviews
- `Instructor`: applies for instructor status, creates courses, uploads lessons, submits for review, tracks earnings
- `Admin`: approves instructors, moderates courses, monitors payments, manages categories and reports

## Main workflows
1. Instructor registers and applies to become an instructor.
2. Admin approves the instructor profile.
3. Instructor creates a course, sections, lessons, and attaches hosted video URLs.
4. Instructor submits the course for review.
5. Admin approves or rejects the course.
6. Student purchases the course.
7. Payment success creates enrollment.
8. Student watches lessons and progress is stored.

## Run locally
### Backend
```bash
cd backend
npm install
npm run db:setup
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and expects the API at `http://localhost:4000`.

## Local demo users
- `admin@edubridge.mn` / `123456`
- `nomin@edubridge.mn` / `123456`
- `ariunaa@edubridge.mn` / `123456`

## Notes
- Videos should live in `Mux`, `Bunny Stream`, `Vimeo`, `Cloudinary`, or `S3`, not inside the database.
- Payments should be integrated through a gateway such as `QPay`, `Stripe`, or another local provider.
- Backend now uses `Prisma + PostgreSQL`.
- Update `backend/.env` with your real PostgreSQL credentials before running `npm run db:setup`.
