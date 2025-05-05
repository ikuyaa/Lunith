import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql',
  schema: "./shared/drizzle/schema",
  out: "./shared/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
})