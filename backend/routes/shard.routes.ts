import { requireUserRole } from "@backend/utils/user.utils";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "@shared/constants/status-codes.conastants";
import { db } from "@shared/drizzle/db";
import { shardLocation } from "@shared/drizzle/schema/shard.schema";
import { UserRoleTypes } from "@shared/drizzle/schema/user.schema";
import { Log } from "@shared/lib/logger.lib";
import type { HonoContext } from "@shared/types/hono-ctx";
import { Hono, type Context } from "hono";
import type { BlankInput } from "hono/types";

export const shardApp = new Hono<HonoContext>()
.post('/location/create', async (c) => {
    return await createLocationRoute(c)
})


async function createLocationRoute(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message:" ", error: 'Unauthorized' }, UNAUTHORIZED)
    }

    const { location, description } = await c.req.json();
    if(!location) {
        return c.json({ message:" ", error: 'Location is required' }, BAD_REQUEST)
    }
    
    try {
        await db.insert(shardLocation).values({
            location,
            description: description || null, 
        });
    } catch (err) {
        const error = err as Error;
        Log.error('Error creating location in database: ', error);
        if(error.message.includes("duplicate key value violates unique constraint")) {
            return c.json({ message: "", error: 'Location already exists' }, BAD_REQUEST)
        }
        
        return c.json({ message: "", error: 'Error creating location in database' }, INTERNAL_SERVER_ERROR)
    }

    return c.json({ message: 'Location created successfully', error: "" }, OK)
}