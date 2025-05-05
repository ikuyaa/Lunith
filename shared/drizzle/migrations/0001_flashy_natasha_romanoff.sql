CREATE TYPE "public"."node_status" AS ENUM('ONLINE', 'ERROR', 'OFFLINE', 'MAINTENANCE');--> statement-breakpoint
CREATE TYPE "public"."employeeRoles" AS ENUM('CUSTOMER_SUPPORT', 'ADMIN', 'ROOT');--> statement-breakpoint
CREATE TYPE "public"."userRoles" AS ENUM('BASE_USER', 'ACTIVE_SERVER_USER', 'EMPLOYEE');--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" text PRIMARY KEY DEFAULT '6entno6sma63cupg' NOT NULL,
	"token" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "node_status" DEFAULT 'OFFLINE' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nodes_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "userRole" "userRoles" DEFAULT 'BASE_USER' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "employeeRole" "employeeRoles";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dateOfBirth" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");