ALTER TABLE "admin_teams" ADD COLUMN "rg" text;--> statement-breakpoint
ALTER TABLE "admin_teams" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "admin_teams" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "admin_teams" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "admin_teams" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "admin_teams" ADD COLUMN "updated_at" timestamp DEFAULT now();