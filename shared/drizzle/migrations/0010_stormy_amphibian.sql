ALTER TABLE "nodes" ALTER COLUMN "id" SET DEFAULT '6entntpcma90577p';--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "ipAddress" text;--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "ipv4Address" text;