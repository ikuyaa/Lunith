import type { TypedUser } from "@shared/types/auth.types";
import { type UserRole, UserRoles } from '@shared/drizzle/schema/user.schema';

export const requireUserRole = (user: TypedUser, requiredRole: UserRole) => {
    if (!user) {
        console.log('No user provided');
        return false;
    }
    const userRole = user.userRole as UserRole;
    const userIndex = UserRoles.enumValues.indexOf(userRole);
    const requiredIndex = UserRoles.enumValues.indexOf(requiredRole);
    console.log(`User role: ${userRole}, Required role: ${requiredRole}`);
    console.log(`User index: ${userIndex}, Required index: ${requiredIndex}`);
    if (userIndex === -1 || requiredIndex === -1) {
        console.log('Invalid role detected');
        return false;
    }
    const result = userIndex >= requiredIndex;
    console.log(`Access granted: ${result}`);
    return result;
}