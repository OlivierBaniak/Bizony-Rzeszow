ALTER TABLE "login_logs" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
