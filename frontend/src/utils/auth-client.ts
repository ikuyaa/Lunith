import { createAuthClient } from "better-auth/react"
import { dateOfBirthClientPlugin } from '@shared/plugins/auth/dateOfBirth/client';
import { usernameClient } from "better-auth/client/plugins";
import { userRolesClientPlugin } from '@shared/plugins/auth/userRoles/client';
import { type LoginFormValues, type RegisterFormValues } from "@shared/schemas/auth.schemas";
import { capitalizeName } from "./user.utils";
import { type TypedSession, type TypedUser } from "@shared/types/auth.types";
import { UserRoles } from "@shared/drizzle/schema/user.schema";
import { type UserRole } from '@shared/drizzle/schema/user.schema';
export const authClient = createAuthClient({
    baseURL: "http://localhost:42069", // The base URL of your auth server
    plugins: [
        dateOfBirthClientPlugin(),
        usernameClient(),
        userRolesClientPlugin(),
    ]
});

export async function validateSession() {
    const session = await authClient.getSession()
    if(!session.data) {
        return {
            user: null,
            session: null,
        }
    }

    return {
        user: session.data.user as TypedUser,
        session: session.data.session as TypedSession,
    }

}

export async function registerUser(values: RegisterFormValues) {
    try {
        const name = `${values.firstName} ${values.lastName}`;
        const parsedName = capitalizeName(name);
        const { data, error } = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            username: values.username,
            name: parsedName,
            dateOfBirth: values.dateOfBirth,
        });
    
        if (error) {
            throw new Error(error.message);
        }
    
        return data;
    } catch (err) {
        console.error("Error registering user:", err);
        throw err;
    }
}

export async function loginUserEmail(values: LoginFormValues) {
    try {
        const { data, error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });
    
        if (error) {
            throw new Error(error.message);
        }
    
        return data;
    } catch (err) {
        console.error("Error logging in user:", err);
        throw err;
    }
}

export async function logoutUser() {
    try {
        const { data, error } = await authClient.signOut()
        if(error) {
            throw error;
        }

        return data;

    } catch (err) {
        console.error("Error logging out user:", err);
        throw err;
    }
}

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

