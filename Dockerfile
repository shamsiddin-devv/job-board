FROM node:24-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./

FROM base AS build
RUN npm ci --no-audit --no-fund
COPY prisma.config.ts tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run db:generate && npm run build

FROM build AS migrate
USER node
CMD ["npm", "run", "db:migrate"]

FROM base AS runtime
ENV NODE_ENV=production PORT=4000
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
USER node
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s CMD ["node", "-e", "fetch('http://127.0.0.1:' + process.env.PORT + '/api/health/ready').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "dist/src/main.js"]
