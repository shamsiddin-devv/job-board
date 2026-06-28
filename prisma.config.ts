import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/infrastructure/db/prisma/schema.prisma",
  migrations: {
    path: "src/infrastructure/db/prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
