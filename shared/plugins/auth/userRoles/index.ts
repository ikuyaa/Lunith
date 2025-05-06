import type { BetterAuthPlugin } from "better-auth";

export const userRolesPlugin = () => ({
    id: "userRoles",
    schema: {
        user: {
            fields: {
                userRole: {
                    type: 'string',
                    required: true,
                    input: false,
                    defaultValue: 'BASE_USER',       
                },
            }
        }
    },
} satisfies BetterAuthPlugin);