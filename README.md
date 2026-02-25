# FixSure MVP

Production-ready MVP for a subscription-based home maintenance startup.

## Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT (phone + mock OTP flow)

## Folder Structure
```
FixSure/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/auth.js
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/seedData.js
│   │   └── server.js
│   └── .env.example
├── frontend/
│   ├── src/app/ (pages)
│   ├── src/components/
│   ├── src/lib/api.ts
│   └── .env.local.example
└── package.json (workspaces)
```

## Core API Routes
### Auth
- `POST /api/auth/otp/send`
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Customer
- `GET /api/services/customer/dashboard`
- `POST /api/services/customer/book`
- `PATCH /api/services/customer/rate/:id`

### Technician
- `GET /api/services/technician/jobs`
- `PATCH /api/services/technician/jobs/:id`

### Admin
- `GET /api/admin/metrics`
- `GET /api/admin/technicians`
- `GET /api/admin/plans`
- `POST /api/admin/plans`
- `PUT /api/admin/plans/:id`
- `PATCH /api/services/admin/jobs/:id/assign`
- `PATCH /api/services/admin/jobs/:id/override`
- `GET /api/admin/complaints`
- `POST /api/admin/complaints`

## Database Schemas
- User (customer/technician/admin)
- SubscriptionPlan
- ServiceRequest (status tracking, warranty, history)
- Complaint

## Setup Instructions (Local)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup backend env:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Setup frontend env:
   ```bash
   cp frontend/.env.local.example frontend/.env.local
   ```
4. Start MongoDB locally (default URI in env example).
5. Seed sample data:
   ```bash
   npm run seed
   ```
6. Run both apps:
   ```bash
   npm run dev
   ```
7. Open frontend at `http://localhost:3000`.

## Sample Seed Credentials
Password for all users: `123456`
- Customer: `9999911111`
- Technician: `9999922222`
- Admin: `9999933333`

## Production Notes
- Use strong `JWT_SECRET`.
- Point `MONGO_URI` and `NEXT_PUBLIC_API_BASE_URL` to deployed services.
- Put backend behind HTTPS reverse proxy and object storage for uploads.
