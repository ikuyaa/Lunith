CREATE TABLE "node_locations" (
	"id" text PRIMARY KEY DEFAULT '6entns4gmabut0uo' NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nodes" ALTER COLUMN "id" SET DEFAULT '6entns4gmabut0un';--> statement-breakpoint
ALTER TABLE "nodes" DROP COLUMN "location";