import { requireUserRole } from "@backend/utils/user.utils";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "@shared/constants/status-codes.conastants";
import { db } from "@shared/drizzle/db";
import { UserRoleTypes } from "@shared/drizzle/schema/user.schema";
import { Log } from "@shared/lib/logger.lib";
import type { HonoContext } from "@shared/types/hono-ctx";
import { Hono, type Context } from "hono";
import type { BlankInput } from "hono/types";
import { shardLocation } from '../../shared/drizzle/schema/shard.schema';
import { eq } from "drizzle-orm";

export const shardApp = new Hono<HonoContext>()
.post('/location/create', async (c) => {
    return await createLocationRoute(c)
})
.get('/location/all', async (c) => {
    return await getLocationsRoute(c)
})


async function createLocationRoute(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }

    const { location, description } = await c.req.json();
    if(!location) {
        return c.json({ message: null, error: 'Location is required' }, BAD_REQUEST)
    }

    //Sanitizing the location input
    if(typeof location !== "string" || location.length > 100) {
        return c.json({ message: null, error: 'Location must be a string and less than 100 characters' }, BAD_REQUEST)
    }
    //Sanitizing the description input
    if(description && (typeof description !== "string" || description.length > 255)) {
        return c.json({ message: null, error: 'Description must be a string and less than 255 characters' }, BAD_REQUEST)
    }
    //Checking if the location already exists in the database
    const existingLocation = await db.select().from(shardLocation).where(eq(shardLocation.location, location)).limit(1);
    if(existingLocation.length > 0) {
        return c.json({ message: null, error: 'Location already exists' }, BAD_REQUEST)
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
            return c.json({ message: null, error: 'Location already exists' }, BAD_REQUEST)
        }
        
        return c.json({ message: null, error: 'Error creating location in database' }, INTERNAL_SERVER_ERROR)
    }

    return c.json({ message: 'Location created successfully', error: null }, OK)
}

async function getLocationsRoute(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }

    try {
        const locations = await db.select().from(shardLocation);
        return c.json({ message: locations, error: null }, OK)
    } catch (err) {
        const error = err as Error;
        Log.error('Error getting locations from database: ', error);
        return c.json({ message: null, error: 'Error getting locations from database' }, INTERNAL_SERVER_ERROR)
    }
}