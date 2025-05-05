import { MIN_SIGNUP_AGE } from "../../../config/auth.config";
import { SIGNUP_PATH_STARTSWITH } from "../../../constants/auth.constants";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";

export const dateOfBirthPlugin = () => ({
    id: "dateOfBirth",
    schema: {
        user: {
            fields: {
                dateOfBirth: {
                    type: 'date',
                    required: true,
                    input: true,  
                }
            }
        }
    },
    hooks: {
        before: [
            {
                matcher: (ctx) => ctx.path.startsWith(SIGNUP_PATH_STARTSWITH),
                handler: createAuthMiddleware(async (ctx) => {  
                    const { dateOfBirth } = ctx.body as { dateOfBirth: Date };
                    if(!dateOfBirth) {
                        throw new APIError('BAD_REQUEST', { message: 'Birthday is required.' })
                    }

                    const today = new Date();
                    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - MIN_SIGNUP_AGE));

                    if(dateOfBirth >= minAgeDate) {
                        throw new APIError('BAD_REQUEST', {
                            message: `You must be at least ${MIN_SIGNUP_AGE} years old to sign up.`
                        })
                    }

                    return { context: ctx };

                }),
            }
        ]
    }
} satisfies BetterAuthPlugin);