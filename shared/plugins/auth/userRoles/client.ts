import type { BetterAuthClientPlugin } from "better-auth";
import type { userRolesPlugin } from "./index";

type UserRolesPlugin = typeof userRolesPlugin ;

export const userRolesClientPlugin = () => ({
    id: "userRoles",
    $InferServerPlugin: {} as ReturnType<UserRolesPlugin>
}) satisfies BetterAuthClientPlugin;