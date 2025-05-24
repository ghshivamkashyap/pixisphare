# Pixisphere Server

A Node.js backend API for the Pixisphere platform, built with Express, MongoDB (Mongoose), JWT authentication, and modular route structure. This server powers the core business logic for user management, partner onboarding, inquiries, portfolios, reviews, and admin operations.

## Features
- User authentication (JWT, bcrypt)
- Role-based access (client, partner, admin)
- Partner onboarding and verification
- Inquiry management and partner assignment
- Portfolio management for partners
- Category and location management (admin)
- Review system (admin moderation)
- Rate limiting and request logging
- Swagger API documentation at `/api-docs`

## Folder Structure
```
server/
  app.js                # Main Express app
  package.json          # Project metadata and scripts
  config/               # Configuration files
  controllers/          # Route controllers (business logic)
  middlewares/          # Express middlewares (auth, roles, etc.)
  models/               # Mongoose models (User, Inquiry, etc.)
  routes/               # Express route definitions
  services/             # (For business logic/services)
  utils/                # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)

### Installation
1. Clone the repository and navigate to the `server` directory:
   ```powershell
   git clone <repo-url>
   cd pixisphare/server
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pixisphere
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```powershell
   npm run dev
   ```

## API Documentation
- Interactive Swagger docs: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- All endpoints are documented with request/response schemas and security requirements.

## Key Endpoints
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `POST /api/partner/onboard` — Partner onboarding (role: partner)
- `POST /api/inquiry/inquiry` — Create an inquiry (role: client)
- `GET /api/partner/portfolio` — Get partner's portfolio
- `POST /api/partner/portfolio` — Add portfolio item
- `GET /api/admin/verifications` — Admin: pending partner verifications
- `PUT /api/admin/verify/:id` — Admin: verify/reject partner
- `POST /api/admin/categories` — Admin: add category
- `POST /api/admin/locations` — Admin: add location
- `GET /api/admin/reviews` — Admin: get all reviews

> See Swagger docs for the full list and details.

## Security & Best Practices
- All sensitive endpoints require JWT authentication.
- Role-based middleware restricts access to protected routes.
- Rate limiting and request logging are enabled by default.
- Environment variables are used for secrets and DB config.

## Contributing
Pull requests are welcome! Please open issues for bugs or feature requests.

## License
[MIT](LICENSE)

---
*UI section will be added soon.*
