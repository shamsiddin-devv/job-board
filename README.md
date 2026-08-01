# JobBoard

A two-sided job marketplace where companies post job vacancies and workers can also publish "hire me" profiles. Built with Clean Architecture (Domain-Driven Design) principles — fully testable, framework-agnostic business logic, and easy to extend.

## What makes this different from a typical job board

- **Two-sided** — not only companies post jobs; workers can publish their own profiles to be discovered by companies
- **Clean Architecture** — Domain, Application, Infrastructure, and Presentation layers are fully separated, keeping business logic independent of frameworks and databases
- **Full Auth system** — Email/password, OTP-based email verification, Google and GitHub OAuth, Access + Refresh token rotation
- **Production-ready** — Docker, Redis caching, Swagger documentation, centralized error handling

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Cache / OTP storage | Redis |
| Auth | JWT (Access + Refresh), Passport (Google, GitHub OAuth) |
| File storage | Cloudinary |
| Email | Nodemailer |
| Documentation | Swagger (OpenAPI) |
| Containerization | Docker, Docker Compose |

## Architecture

The project follows Clean Architecture, split into 4 layers:

```
src/
├── domain/          # Business rules — zero dependency on external libraries
│   ├── entities/      # Job, User, Company, Application, Resume...
│   ├── value-objects/ # Email, SalaryRange
│   ├── repositories/  # Interfaces (contracts)
│   ├── services/       # Interfaces (Hash, Token, Email, Storage, Cache)
│   └── errors/           # DomainError and its subtypes
│
├── application/      # Use Cases — where business logic actually runs
│   └── use-cases/
│       ├── auth/
│       ├── job/
│       ├── application/
│       ├── company/
│       ├── notification/
│       ├── resume/
│       └── saved-job/
│
├── infrastructure/   # Real technologies — Prisma, Redis, Cloudinary, JWT
│   ├── db/
│   ├── redis/
│   ├── auth/
│   ├── email/
│   └── storage/
│
└── presentation/      # HTTP layer — Controllers, Guards, DTOs, Modules
    ├── modules/
    ├── guards/
    ├── decorators/
    └── filters/
```

**Core principle:** `domain/` never knows about `infrastructure/` or any framework. Every repository and service is consumed through an interface, so swapping Prisma for another ORM, or Nodemailer for another email provider, only requires a new implementation — the business logic never changes.

## Key Features

- **Auth** — Register/Login, OTP-based email verification, Google/GitHub OAuth, password reset, Access+Refresh token rotation
- **Jobs** — Post vacancies/CVs, edit, close, search with filters and sorting, view count tracking
- **Applications** — Apply to jobs, accept/reject applicants, list applicants per job
- **Companies** — Create company profile, admin verification
- **Resumes** — Worker CV profile, PDF upload (Cloudinary)
- **Saved Jobs** — Bookmark vacancies
- **Notifications** — Automatic notifications when application status changes

## Getting Started

### 1. Local (without Docker)

```bash
git clone <repo-url>
cd jobboard
npm install
cp .env.example .env    # fill in the values
npx prisma migrate dev
npm run start:dev
```

### 2. With Docker (recommended)

```bash
cp .env.docker.example .env.docker    # fill in the values
docker-compose up --build
```

This spins up the backend, PostgreSQL, and Redis together.

## API Documentation

Once the server is running, full interactive API docs are available at:

```
http://localhost:4000/api/docs
```

## Environment Variables

See `.env.example` for the full list of required variables:

```
DATABASE_URL, REDIS_URL
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
SMTP_EMAIL, SMTP_PASS
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL
```

## Project Status

Backend is complete: Domain, Application, Infrastructure, and Presentation layers, all modules (Auth, Job, Application, Company, Notification, Resume, SavedJob), Swagger documentation, and Docker configuration.

## License

MIT