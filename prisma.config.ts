import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Vercel'den çekilen .env.local önce gelir
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migration'lar Neon'un havuzsuz (doğrudan) bağlantısıyla çalışmalı
    url: process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"],
  },
});
