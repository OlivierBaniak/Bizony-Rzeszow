#!/usr/bin/env tsx
/**
 * Skrypt do stworzenia pierwszego admina w bazie Supabase.
 * Użycie: npx tsx script/seed-admin.ts
 */
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "../shared/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ Brak DATABASE_URL w zmiennych środowiskowych");
  process.exit(1);
}

const USERNAME = process.env.ADMIN_USERNAME || "admin";
const PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";

async function main() {
  const client = postgres(DATABASE_URL!, { ssl: "require" });
  const db = drizzle(client);

  console.log(`Tworzę admina: ${USERNAME}`);
  const hashed = await bcrypt.hash(PASSWORD, 10);

  await db.insert(users).values({
    username: USERNAME,
    password: hashed,
    role: "admin",
  }).onConflictDoNothing();

  console.log("✅ Admin utworzony!");
  console.log(`   Login: ${USERNAME}`);
  console.log(`   Hasło: ${PASSWORD}`);
  await client.end();
}

main().catch(e => {
  console.error("❌ Błąd:", e.message);
  process.exit(1);
});
