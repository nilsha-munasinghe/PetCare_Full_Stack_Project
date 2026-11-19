# PetCare - Pet Care Booking System

A full-stack Pet Care Booking System developed as a Rapid Application Development (RAD) coursework project.

## Technology stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios
- Backend: Node.js, Express 4, TypeScript, Mongoose
- Database: MongoDB local or MongoDB Atlas
- Security: bcryptjs password hashing, expiring JWT access tokens, rotating refresh tokens, role-based authorization
- Advanced feature: PDF appointment report

## Project structure
- backend/src/config: database connection
- backend/src/controllers: authentication, users, pets, services, appointments, shop and reports
- backend/src/middleware: authentication, async handling and error handling
- backend/src/models: Mongoose models
- backend/src/routes: REST API routes
- frontend/src/pages: React pages
- frontend/src/store.ts: Redux Toolkit authentication state

## Requirements
Node.js 20+, npm, and MongoDB local or MongoDB Atlas.

## Local setup

### Backend
1. Open a terminal in the backend folder.
2. Run npm install.
3. Copy .env.example to .env.
4. Set MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, CLIENT_URL and PORT.
5. Run npm run dev.

### Seed sample data
In the backend folder run npm run seed. This creates the sample veterinary services and shop products if they do not already exist.

### Frontend
1. Open a second terminal in the frontend folder.
2. Run npm install.
3. Copy .env.example to .env.
4. Set VITE_API_URL to http://localhost:5000/api for local development.
5. Run npm run dev.

## First administrator
Register a normal account, then promote that account directly in MongoDB Compass or Atlas:
    db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } })
Do not expose public admin registration. Sign out and sign in again after changing the role.

## API endpoints
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/refresh | Refresh token | Rotate tokens |
| POST | /api/auth/logout | Public | Revoke refresh token |
| GET/POST | /api/pets | User | List/create pets |
| PUT/DELETE | /api/pets/:id | Owner/Admin | Update/delete pet |
| GET | /api/services | Public | List active services |
| POST/PUT/DELETE | /api/services | Admin | Manage services |
| GET/POST | /api/appointments | User | List/book appointments |
| PATCH | /api/appointments/:id | Owner/Admin | Cancel/change status |
| PATCH | /api/appointments/:id/reschedule | Owner/Admin | Reschedule |
| GET | /api/admin/users | Admin | List users |
| PATCH | /api/admin/users/:id | Admin | Change role/account status |
| GET | /api/shop/products | Public | Browse products |
| POST | /api/shop/orders | User | Place an order |
| GET | /api/shop/orders | User/Admin | Own/all orders |
| GET | /api/reports/appointments.pdf | Admin | Download PDF report |

Protected endpoints require an Authorization Bearer access token.

## Postman testing
1. Register and login; save token and refreshToken from the response.
2. Use Bearer token for protected endpoints.
3. Test customers can only access their own pets and appointments.
4. Promote a test account to admin in MongoDB and test admin routes.
5. Test invalid input, duplicate email, invalid IDs, past dates, booking conflicts, insufficient stock and invalid order status.
6. Test refresh-token rotation and logout.
7. Verify customers cannot download the admin PDF report.

## Deployment
### MongoDB Atlas
Create a cluster and database user, configure Network Access for the hosting provider, and put the Atlas connection string in backend MONGO_URI.

### Backend on Render or Railway
- Root directory: backend
- Build command: npm install && npm run build
- Start command: npm start
- Add MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, CLIENT_URL, NODE_ENV=production and PORT as environment variables.

### Frontend on Vercel or Netlify
- Root directory: frontend
- Build command: npm install && npm run build
- Output directory: dist
- Set VITE_API_URL to the deployed backend URL followed by /api.

After deployment, test registration, login, pet CRUD, appointment booking/rescheduling/cancellation, admin operations, shop orders and PDF generation against the live URLs.

Never commit real .env files or expose production secrets.
