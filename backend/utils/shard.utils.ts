import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "@shared/constants/status-codes.conastants";
import { UserRoleTypes } from "@shared/drizzle/schema/user.schema";
import { Log } from "@shared/lib/logger.lib";
import type { HonoContext } from "@shared/types/hono-ctx";
import type { Context } from "hono";
import type { BlankInput } from "hono/types";
import { requireUserRole } from "./user.utils";
import { shard, shardLocation } from "@shared/drizzle/schema/shard.schema";
import { db } from "@shared/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { uClient } from "..";
import { SHARD_LOCATION_CACHE_KEY } from "@shared/constants/shard.constants";
import type { ShardLocation } from "@shared/types/shard.types";
import { TimeSecs } from "@shared/lib/time.lib";


export async function createLocation(c: Context<HonoContext, string, BlankInput>) {
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
        const newLocation = await db.insert(shardLocation).values({
            location,
            description: description || null, 
        }) as unknown as ShardLocation;

        //Caching the new location
        await uClient.cache.set(`${SHARD_LOCATION_CACHE_KEY}${newLocation.id}`, JSON.stringify(newLocation), 'EX', TimeSecs.hours(5));
        return c.json({ message: 'Location created successfully', error: null }, OK)
    } catch (err) {
        const error = err as Error;
        Log.error('Error creating location in database: ', error);
        
        if(error.message.includes("duplicate key value violates unique constraint")) {
            return c.json({ message: null, error: 'Location already exists' }, BAD_REQUEST)
        }
        
        return c.json({ message: null, error: 'Error creating location in database' }, INTERNAL_SERVER_ERROR)
    }
}

//NEEDS REDIS CACHING
export async function getLocations(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }
    try {
        const locations = await db
            .select({
                id: shardLocation.id,
                location: shardLocation.location,
                description: shardLocation.description,
                createdAt: shardLocation.createdAt,
                updatedAt: shardLocation.updatedAt,
                shards: sql<number>`count(${shard.id})::int`
            })
            .from(shardLocation)
            .leftJoin(shard, eq(shard.locationId, shardLocation.id))
            .groupBy(shardLocation.id);

        return c.json({ message: locations, error: null }, OK)
    } catch (err) {
        const error = err as Error;
        Log.error('Error getting locations from database: ', error);
        return c.json({ message: null, error: 'Error getting locations from database' }, INTERNAL_SERVER_ERROR)
    }
}

//NEEDS REDIS CACHING
export async function deleteLocationByID(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }

    const locationId  = c.req.param('locationId')
    if(!locationId) {
        return c.json({ message: null, error: 'Location ID is required' }, BAD_REQUEST)
    }


    //Sanitizing the location input
    if(typeof locationId !== "string" || locationId.length > 1000) {
        return c.json({ message: null, error: 'Location must be a number and less than 100 characters' }, BAD_REQUEST)
    }
    
    const id = Number(locationId);
    try {
        await db.delete(shardLocation).where(eq(shardLocation.id, id));
        return c.json({ message: 'Location deleted successfully', error: null }, OK)
    } catch (err) {
        const error = err as Error;
        Log.error('Error deleting location from database: ', error);
        return c.json({ message: null, error: 'Error deleting location from database' }, INTERNAL_SERVER_ERROR)
    }
}

//NEEDS REDIS CACHING
export async function deleteMultipleLocationsByID(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context, then checking if the user is an admin
    const user = c.get('auth').user;
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }
    const locationIds = c.req.param('locationIds')
    Log.alert('Location IDs: ' + locationIds)
    if(!locationIds) {
        return c.json({ message: null, error: 'Location IDs are required' }, BAD_REQUEST)
    }

    const ids = locationIds.split(',').map((id) => Number(id.trim()));

    Log.alert('Deleting locations with IDs: ' + ids);

    try {
        ids.forEach(async (id) => {
            await db.delete(shardLocation).where(eq(shardLocation.id, id));
        });
    } catch (err) {
        const error = err as Error;
        Log.error('Error deleting locations from database: ', error);
        return c.json({ message: null, error: 'Error deleting one or more locations from database' }, INTERNAL_SERVER_ERROR)
    }

    return c.json({ message: 'Locations deleted successfully', error: null }, OK)
}

//NEEDS REDIS CACHING
export async function updateLocationByID(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }

    const { location, description, locationId } = await c.req.json();
    Log.info(`Update request received: ${locationId} ${location} ${description}`);
    if(!locationId || !location && !description) {
        return c.json({ message: null, error: 'Location ID, and at least a new location or description is required' }, BAD_REQUEST)
    }

    //Sanitizing the location input
    if(typeof locationId !== "string" || locationId.length > 1000) {
        return c.json({ message: null, error: 'Location must be a number and less than 100 characters' }, BAD_REQUEST)
    }
    
    const id = Number(locationId);
    try {
        Log.info(`Updating location in database: ${id} ${location} ${description}`);

        await db.update(shardLocation).set({
            location: location,
            description: description
        }).where(eq(shardLocation.id, id));

        return c.json({ message: 'Location updated successfully', error: null }, OK)
    } catch (err) {
        const error = err as Error;
        Log.error('Error updating location in database: ', error);
        return c.json({ message: null, error: 'Error updating location in database' }, INTERNAL_SERVER_ERROR)
    }
}