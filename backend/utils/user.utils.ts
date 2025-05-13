import type { TypedUser } from "@shared/types/auth.types";
import { type UserRole, UserRoles } from '@shared/drizzle/schema/user.schema';
import { Log } from "@shared/lib/logger.lib";

export const requireUserRole = (user: TypedUser, requiredRole: UserRole) => {
    if (!user) {
        console.log('No user provided');
        return false;
    }
    const userRole = user.userRole as UserRole;
    const userIndex = UserRoles.enumValues.indexOf(userRole);
    const requiredIndex = UserRoles.enumValues.indexOf(requiredRole);
    Log.info(`User role: ${userRole}, Required role: ${requiredRole}`);
    Log.info(`User index: ${userIndex}, Required index: ${requiredIndex}`);
    if (userIndex === -1 || requiredIndex === -1) {
        Log.error('Invalid role detected');
        return false;
    }
    const result = userIndex >= requiredIndex;
    Log.info(`Access granted: ${result}`);
    return result;
}