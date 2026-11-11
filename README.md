# WorkUZ Job Board API

WorkUZ is a NestJS REST API for worker and company accounts, vacancies, applications, resumes, saved jobs, notifications, and admin moderation. It uses PostgreSQL with Prisma, Redis for OTP, SMTP for mail, and Cloudinary for uploads.

## Local setup

Use Node.js 24, PostgreSQL, and Redis. Copy `.env.example` to `.env` and configure the services you intend to exercise. Generate three distinct random JWT signing secrets. The provider values in the example are placeholders.

```sh
npm ci
npm run db:generate
npm run db:migrate
npm run start:dev
```

For local Docker Compose, copy `.env.example` to `.env.docker`, replace the provider values and secrets, and run `docker compose up --build`. Compose starts its own database and Redis and applies migrations before starting the API. Its database credentials are for local use.

The API prefix is `/api`. Swagger is available at `http://localhost:4000/api-docs` outside production. `GET /api/health/live` reports process health. `GET /api/health/ready` returns 503 when PostgreSQL or Redis cannot respond.

## Verification

```sh
npm run typecheck
npm run build
npm test -- --runInBand
npm run test:e2e
npm audit --omit=dev
```

The HTTP test expects an explicitly configured `DATABASE_URL` pointing to a freshly migrated test database named `workuz_ci` or `workuz_test_<id>`, plus `REDIS_URL` pointing to a test Redis. It uses a test mailer to retrieve the OTP. CI starts PostgreSQL and Redis service containers and builds the production image. Set `WORKUZ_TEST_REDIS=stub` only to exercise the HTTP and database paths when local Redis is unavailable. That mode skips Redis-specific assertions.

## Oracle Cloud Always Free VPS

For a single VM with HTTPS, PostgreSQL, and Redis, use the [Oracle VPS deployment guide](deploy/oracle-vps.md).

## Render Free without a VPS

For the card-free hosting option, use the [Render Free deployment guide](deploy/render-free.md).

## Production rollout

1. Provision PostgreSQL and Redis with restricted network access. Configure HTTPS, the API and frontend origins, OAuth callback URLs, Cloudinary, and SMTP. Use a secret store for credentials. Keep the API and browser frontend on the same site for the existing refresh-cookie flow. Send browser requests that use refresh or OAuth registration cookies with credentials enabled.
2. Build and run the `migrate` Docker target once as a release job against the target database, then roll out the `runtime` target. Use the readiness endpoint to gate traffic. Without Docker, build with `npm run build` and start with `npm run start:prod`.
3. Before applying migrations to a database provisioned before this release, take a backup and compare its schema against `0_init`. If it already matches that migration, mark `0_init` as applied with `npx prisma migrate resolve --applied 0_init` before running `npm run db:migrate`. Resolve any drift on a staging copy first. See the [Prisma baselining guide](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining).
4. In staging, verify email delivery and password reset, complete real Google and GitHub callbacks, and upload a test PDF and image. Check that expired or blocked sessions are rejected. Existing OAuth accounts with a null password and `LOCAL` provider need manual review because earlier versions did not persist the provider. Use verified account records to recover them.
5. Before switching traffic, verify alerts on HTTP errors and dependency readiness, a PostgreSQL backup restore, and rate limits at the ingress for authentication and file uploads. Retain the previous application image for rollback and review migration compatibility before rolling back application code.

`POST /api/auth/verify` returns the verified user. Call `POST /api/auth/login` afterward to establish a session. OAuth completion takes a role and requires the signed cookie set by the provider callback.
