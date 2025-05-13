import { UserRoles } from "@shared/drizzle/schema/user.schema";
import { z } from "zod";
export const UserRoleSchema = z.enum(UserRoles.enumValues as [string, ...string[]]);
export const UserRoleCheckSchema = z.object({
    id: z.string(),
    username: z.string(),
    userRole: UserRoleSchema
})