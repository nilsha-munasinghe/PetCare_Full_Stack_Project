# PetCare REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register customer |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | Authenticated | Current user |
| GET | `/pets` | Authenticated | List own pets (admin sees all) |
| POST | `/pets` | Authenticated | Add pet |
| PUT | `/pets/:id` | Owner/Admin | Update pet |
| DELETE | `/pets/:id` | Owner/Admin | Delete pet |
| GET | `/services` | Public | List active services |
| POST | `/services` | Admin | Create service |
| PUT | `/services/:id` | Admin | Update service |
| DELETE | `/services/:id` | Admin | Delete service |
| GET | `/appointments` | Authenticated | List own appointments (admin sees all) |
| POST | `/appointments` | Authenticated | Book appointment |
| PATCH | `/appointments/:id` | Owner/Admin | Customer cancels; admin changes status |
| GET | `/admin/summary` | Admin | Dashboard totals |
| GET | `/reports/appointments.pdf` | Admin | Download PDF report |

All protected endpoints require `Authorization: Bearer <token>`.
