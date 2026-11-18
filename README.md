# PetCare – Pet Care Booking System

A full-stack coursework project built with the MERN stack and TypeScript.

## Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- Security: JWT access tokens, bcryptjs, role-based authorization
- Advanced feature: PDF appointment report

## Requirements
Node.js 20+, npm, MongoDB local instance or MongoDB Atlas account.

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in `.env`.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL (normally http://localhost:5173).

### First admin
Register a normal account, then promote it to admin directly in MongoDB:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```
Do not expose admin registration publicly.

## Main modules
- Authentication and protected routes
- Pet CRUD
- Service catalogue
- Appointment booking, listing, status update and cancellation
- Admin dashboard and PDF report
- Redux global authentication state

## Coursework checklist
- MERN + TypeScript
- REST API and client/server separation
- Mongoose models and validation
- JWT, bcryptjs and `.env`
- Redux Toolkit
- Tailwind responsive UI
- GitHub version control and cloud deployment

## Deployment
- Database: MongoDB Atlas
- Backend: Render or Railway
- Frontend: Vercel or Netlify
- Configure `VITE_API_URL` on the frontend and environment variables on the backend.
