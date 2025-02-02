import { type Config } from "drizzle-kit";

import { env } from "~/env";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["drive_clone_*"],
}) satisfies Config;
