import type { TypedUser } from "@shared/types/auth.types";
import { type UserRole, UserRoles } from '@shared/drizzle/schema/user.schema';
import { Log } from "@shared/lib/logger.lib";
import { UserRoleCheckSchema, UserRoleSchema } from "@shared/schemas/user.schemas";

export const requireUserRole = (user: TypedUser, requiredRole: UserRole) => {
    //If no user is provided, return false
    if (!user) {
        console.log('No user provided');
        return false;
    }

    //Parsing the user and the role
    const userParse = UserRoleCheckSchema.safeParse(user);
    const requiredRoleParse = UserRoleSchema.safeParse(requiredRole);
    if (!userParse.success) {
        Log.error(`User role check failed: ${userParse.error}`);
        return false;
    }
    if (!requiredRoleParse.success) {
        Log.error(`Required role check failed: ${requiredRoleParse.error}`);
        return false;
    }

    const parsedUser = userParse.data;
    const parsedRequiredRole = requiredRoleParse.data;
    
    //Get the user role and required role and check if they are valid.
    const userRole = parsedUser.userRole as UserRole;
    const requiredRoleVal = parsedRequiredRole as UserRole;
    const userIndex = UserRoles.enumValues.indexOf(userRole);
    const requiredIndex = UserRoles.enumValues.indexOf(requiredRoleVal);

    //Checking if the user role and required role are valid
    if (userIndex === -1 || requiredIndex === -1) {
        Log.error(`Invalid role (${userRole}) detected`);
        return false;
    }

    //Checking if the user role is greater than or equal to the required role
    const result = userIndex >= requiredIndex;
    if(!result) {
        Log.error(`Access denied: User ${user.username}(ID:${user.id})'s role ${userRole} does not meet required role ${requiredRole}. Access has been denied.`);
        return false;
    } else {
        Log.alert(`User ${user.username}(ID: ${user.id}) has accessed a command with required role ${requiredRole}`);
        return true;
    }
}