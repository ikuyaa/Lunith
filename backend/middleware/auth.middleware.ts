import type { HonoContext } from '@shared/types/hono-ctx';
import { auth } from '@shared/lib/auth.lib';
import { Hono } from 'hono';

export async function validSessionCheck(app: Hono<HonoContext>) {
    app.use("*", async(c, next) => {
        const session = await auth.api.getSession({ headers: c.req.raw.headers });
 
  	    if (!session) {
    	    c.set('auth', {
                user: null,
                session: null,   
            })
    	    return next();
  	    }
 
  	    c.set('auth', {
            user: session.user,
            session: session.session,
        });

  	    return next();
    })
}