import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "@shared/constants/status-codes.conastants";
import { UserRoleTypes } from "@shared/drizzle/schema/user.schema";
import { Log } from "@shared/lib/logger.lib";
import type { HonoContext } from "@shared/types/hono-ctx";
import type { Context } from "hono";
import type { BlankInput } from "hono/types";
import { requireUserRole } from "./user.utils";
import { shard, shardLocation } from "@shared/drizzle/schema/shard.schema";
import { db } from "@shared/drizzle/db";
import { eq, inArray, sql } from "drizzle-orm";
import { uClient } from "..";
import { SHARD_LOCATION_CACHE_KEY } from "@shared/constants/shard.constants";
import type { ShardLocation } from "@shared/types/shard.types";
import { TimeSecs } from "@shared/lib/time.lib";
import { createShardSchema, createShardLocationRequestSchema, deleteShardLocationRequestSchema, editShardLocationRequestSchema } from "@shared/schemas/shard.schemas";
import uniqid from 'uniqid';
import { Jwt } from "hono/utils/jwt";


export async function createShardLocation(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }

    const parsedData = createShardLocationRequestSchema.safeParse(await c.req.json());
    if(!parsedData.success) {
        return c.json({ message: null, error: parsedData.error.message }, BAD_REQUEST)
    }
    const { location, description } = parsedData.data;
    
    try {
        const newLocation = await db.insert(shardLocation).values({
            location,
            description: description || null, 
        }) as unknown as ShardLocation;

        //Caching the new location
        await uClient.cache.set(`${SHARD_LOCATION_CACHE_KEY}${newLocation.id}`, JSON.stringify(newLocation), 'EX', TimeSecs.hours(5));
        return c.json({ message: 'Location created successfully', error: null }, OK)
    } catch (err) {
        const error = err as Error & { code?: string };
        Log.error('Error creating location in database: ', error);
        
        if(error.code === '23505') {
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

    //Parsing the incoming data
    const parsedData = deleteShardLocationRequestSchema.safeParse(c.req.param());
    if(!parsedData.success) {
        return c.json({ message: null, error: parsedData.error.message }, BAD_REQUEST)
    }
    
    const { locationId } = parsedData.data;
    try {
        await db.delete(shardLocation).where(eq(shardLocation.id, locationId));
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
    if(!locationIds) {
        return c.json({ message: null, error: 'Location IDs are required' }, BAD_REQUEST)
    }

    //Converting the param into an array of numbers and checking if they are all numbers
    const ids = locationIds.split(',').map((id) => Number(id.trim()));
    if(ids.some((id) => isNaN(id))) {
        return c.json({ message: null, error: 'Location IDs must be numbers' }, BAD_REQUEST)
    }

    Log.alert('Deleting locations with IDs: ' + ids);

    try {
        //Deleting the locations from the database
        await db.delete(shardLocation).where(inArray(shardLocation.id, ids));
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

    const parsedData = editShardLocationRequestSchema.safeParse(await c.req.json());
    if(!parsedData.success) {
        return c.json({ message: null, error: parsedData.error.message }, BAD_REQUEST)
    }
    const { locationId, location, description } = parsedData.data;

    try {
        Log.info(`Updating location in database: ${locationId} ${location} ${description}`);

        await db.update(shardLocation).set({
            location: location,
            description: description
        }).where(eq(shardLocation.id, locationId));

        return c.json({ message: 'Location updated successfully', error: null }, OK)
    } catch (err) {
        const error = err as Error;
        Log.error('Error updating location in database: ', error);
        return c.json({ message: null, error: 'Error updating location in database' }, INTERNAL_SERVER_ERROR)
    }
}

//NEEDS REDIS CACHING
export async function createShard(c: Context<HonoContext, string, BlankInput>) {
    //Getting the user from the context
    const user = c.get('auth').user;

    //Checking for user and if the user is an admin
    if(!user || !requireUserRole(user, UserRoleTypes.ADMIN)) {
        return c.json({ message: null, error: 'Unauthorized' }, UNAUTHORIZED)
    }

    //Parsing the incoming data
    const parsedData = createShardSchema.safeParse(await c.req.json());
    if(!parsedData.success) {
        return c.json({ message: null, error: parsedData.error.message }, BAD_REQUEST)
    }
    const { name, description, locationId, totalMemMB, totalDiskSpaceMB, totalCPUCores, daemonFileDirectory } = parsedData.data;

    //Generating a unique ID for the shard
    const shardId = uniqid();

    //Generate a signed unique token for the shard
    const token = await Jwt.sign({
        id: shardId,
        name,
        description
    },
    process.env.SHARD_JWT_SECRET)

    try {
        await db.insert(shard).values({
            id: shardId,
            token,
            name,
            description: description || null,
            locationId,
            totalMemMB,
            totalDiskSpaceMB,
            totalCPUCores,
            daemonFileDirectory,
            createdBy: user.id,
        });

        return c.json({ message: 'Shard created successfully', error: null }, OK)
    } catch (err) {
        const error = err as Error & { code?: string };
        Log.error('Error creating shard in database: ', error);
        if(error.code === '23505') {
            return c.json({ message: null, error: 'Shard already exists' }, BAD_REQUEST)
        }
        return c.json({ message: null, error: 'Error creating shard in database' }, INTERNAL_SERVER_ERROR)
    }
}