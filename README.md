# Pixisphere Platform

Pixisphere is a full-stack platform for connecting clients with professional photographers (partners), featuring robust admin moderation, onboarding, portfolio management, reviews, and strict role-based access control. The project consists of a Node.js/Express/MongoDB backend API and a modern Next.js/Tailwind CSS frontend UI.

---

## Technologies Used

### Backend (Server)
- **Node.js** (v18+)
- **Express.js**
- **MongoDB** (Mongoose ODM)
- **JWT** for authentication
- **bcrypt** for password hashing
- **Swagger** for API documentation
- **Postman** (collection included for API testing)
- **Morgan** for logging
- **express-rate-limit** for rate limiting
- **Jest** (recommended for testing)

### Frontend (UI)
- **Next.js 13+** (App Router)
- **React**
- **Tailwind CSS**
- **Axios** for API calls
- **JWT** (client-side parsing)
- **Context API** for auth and filters
- **Reusable React components**
- **Custom hooks** for protected routes and data fetching

---

## Setup Instructions

### Backend (Server)
1. **Clone the repository and install dependencies:**
   ```powershell
   git clone <repo-url>
   cd pixisphare/server
   npm install
   ```
2. **Configure environment variables:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pixisphere
   JWT_SECRET=your_jwt_secret
   ```
3. **Start the server:**
   ```powershell
   npm run dev
   ```
4. **API Documentation:**
   - Swagger UI: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
   - Postman collection: See `server/postman/` folder

### Frontend (UI)
1. **Install dependencies:**
   ```powershell
   cd ../ui
   npm install
   ```
2. **Start the development server:**
   ```powershell
   npm run dev
   ```
3. **Open the app:**
   - [http://localhost:3000](http://localhost:3000)

---

## API Endpoints (Summary)

All endpoints are documented in detail at [http://localhost:5000/api-docs](http://localhost:5000/api-docs) (Swagger UI).

### Authentication
| Method | Path                | Description           | Auth | Role |
|--------|---------------------|----------------------|------|------|
| POST   | /api/auth/signup    | Register new user    | No   | -    |
| POST   | /api/auth/login     | Login, get JWT       | No   | -    |

### Partner
| Method | Path                        | Description                        | Auth | Role     |
|--------|-----------------------------|------------------------------------|------|----------|
| POST   | /api/partner/onboard        | Partner onboarding                 | Yes  | partner  |
| POST   | /api/partner/portfolio      | Add portfolio item                 | Yes  | partner  |
| GET    | /api/partner/portfolio      | Get own portfolio                  | Yes  | partner  |
| PUT    | /api/partner/portfolio/:id  | Edit portfolio item                | Yes  | partner  |
| DELETE | /api/partner/portfolio/:id  | Delete portfolio item              | Yes  | partner  |
| GET    | /api/partners               | List all partners (public)         | No   | -        |
| GET    | /api/partners/:id           | Get partner by ID (with details)   | Yes  | any      |

### Inquiry
| Method | Path                        | Description                        | Auth | Role     |
|--------|-----------------------------|------------------------------------|------|----------|
| POST   | /api/inquiry/inquiry        | Create inquiry                     | Yes  | client   |
| GET    | /api/inquiry/partner/leads  | Get assigned inquiries (leads)     | Yes  | partner  |
| GET    | /api/inquiry/categories     | List categories                    | No   | -        |
| GET    | /api/inquiry/locations      | List locations                     | No   | -        |

### Review
| Method | Path                        | Description                        | Auth | Role     |
|--------|-----------------------------|------------------------------------|------|----------|
| POST   | /api/review/create          | Create review for partner          | Yes  | client   |
| GET    | /api/admin/reviews          | Admin: list all reviews            | Yes  | admin    |
| PUT    | /api/admin/reviews/:id      | Admin: edit review                 | Yes  | admin    |
| DELETE | /api/admin/reviews/:id      | Admin: delete review               | Yes  | admin    |

### Admin
| Method | Path                              | Description                        | Auth | Role  |
|--------|-----------------------------------|------------------------------------|------|-------|
| GET    | /api/admin/verifications          | List partners pending verification  | Yes  | admin |
| PUT    | /api/admin/verify/:id             | Approve/reject partner             | Yes  | admin |
| PUT    | /api/admin/feature-partner/:id    | Toggle featured status for partner  | Yes  | admin |
| POST   | /api/admin/categories             | Add category                       | Yes  | admin |
| GET    | /api/admin/categories             | List categories                    | Yes  | admin |
| PUT    | /api/admin/categories/:id         | Update category                    | Yes  | admin |
| DELETE | /api/admin/categories/:id         | Delete category                    | Yes  | admin |
| POST   | /api/admin/locations              | Add location                       | Yes  | admin |
| GET    | /api/admin/locations              | List locations                     | Yes  | admin |
| PUT    | /api/admin/locations/:id          | Update location                    | Yes  | admin |
| DELETE | /api/admin/locations/:id          | Delete location                    | Yes  | admin |

### Other
| Method | Path                | Description           | Auth | Role |
|--------|---------------------|----------------------|------|------|
| GET    | /health             | Health check         | No   | -    |

#### Auth & Role Notes
- All endpoints requiring `Auth: Yes` expect a JWT in the `Authorization: Bearer <token>` header.
- Role-based access is strictly enforced. Admin endpoints require `admin` role, partner endpoints require `partner`, and client endpoints require `client`.
- Public endpoints (e.g., partner listing) do not require authentication.

For detailed request/response schemas, error codes, and example payloads, see the Swagger docs or the Postman collection in the repo.

## UI (Frontend) Documentation

The Pixisphere UI is a Next.js 13+ app (App Router) styled with Tailwind CSS. It provides a role-based, modern interface for clients, partners, and admins.

### Structure & Key Features
- **App Router**: All pages are in `src/app/` using the new Next.js file-based routing.
- **Auth & Role Context**: `context/AuthContext.js` manages JWT auth, user info, and login/logout state. Role-based access is enforced throughout.
- **API Integration**: All API calls use a pre-configured Axios instance (`lib/api.js`) with JWT token support.
- **Reusable Components**: UI is built from modular components (e.g., `PhotographerCard`, `InquiryModal`).
- **Hooks**: `useProtectedPage` enforces role-based route protection. `useFetch` is a generic data-fetching hook.
- **UI/UX**: Responsive, clean design with Tailwind. Navbar adapts to user role.

### Main Pages & Flows
- **Home Page (`/`)**: Lists all photographers/partners. Supports filtering, search, and sorting. Uses `PhotographerCard` for display.
- **Signup/Login (`/signup`, `/login`)**: Auth forms. Signup supports both client and partner roles.
- **Partner Profile (`/partners/[id]`)**: Shows partner details, portfolio, and reviews. Clients can submit inquiries and reviews here.
- **Partner Onboarding (`/partners`)**: Partners submit onboarding info and portfolio samples. Protected by role.
- **Leads (`/leads`)**: Partners view assigned inquiries/leads. Protected by role.
- **Admin Dashboard (`/admin/dashboard`)**: Admins review and verify/reject partner applications. Protected by role.
- **Admin Settings (`/admin/settings`)**: Admins manage categories and locations. Protected by role.
- **Not Allowed (`/not-allowed`)**: Shown to users who try to access unauthorized pages.

### Role-Based Access
- All sensitive pages use `useProtectedPage(role)` to restrict access. Unauthorized users are redirected to `/not-allowed`.
- Navbar links adapt to the logged-in user's role (client, partner, admin).

### State Management
- **AuthContext**: Handles login, logout, and user state. JWT is stored in localStorage and parsed for user info/role.
- **FilterContext**: (Optional) For managing search/filter state across components.

### API Usage
- All API calls use `/api/*` endpoints from the backend. Authenticated requests include the JWT automatically.
- See backend API docs for endpoint details.

### How to Run
1. Install dependencies:
   ```powershell
   cd ui
   npm install
   ```
2. Start the dev server:
   ```powershell
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

### Customization & Extensibility
- Add new pages in `src/app/`.
- Add new components in `src/app/components/`.
- Use `useProtectedPage` to protect new routes by role.
- Extend `AuthContext` for more auth features.

---

## Submitting & Testing
- **README**: This file contains all setup, usage, and documentation details.
- **Postman Collection**: Provided in `server/postman/` for easy API testing.
- **Swagger Docs**: Full API reference at `/api-docs` when server is running.
- **Testing**: Backend is structured for easy extension with Jest or your preferred test runner.

---

## License
[MIT](LICENSE)
