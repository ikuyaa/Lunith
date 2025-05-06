import type { auth } from "../lib/auth.lib"

export type HonoContext = {
    Variables: {
        auth: {
            user: typeof auth.$Infer.Session.user | null;
            session: typeof auth.$Infer.Session.session | null;
        }
    }
}

