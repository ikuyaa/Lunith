import type { HonoContext } from "@shared/types/hono-ctx";
import { Hono } from "hono";
import { createLocation, deleteLocationByID, deleteMultipleLocationsByID, getLocations, updateLocationByID } from "@backend/utils/shard.utils";

export const shardApp = new Hono<HonoContext>()
.post('/location/create', async (c) => {
    return await createLocation(c);
})
.get('/location/all', async (c) => {
    return await getLocations(c);
})
.delete('/location/delete/:locationId', async (c) => {
    return await deleteLocationByID(c);
})
.delete('/location/delete/multiple/:locationIds', async (c) => {
    return await deleteMultipleLocationsByID(c);
})
.post('/location/update', async (c) => {
    return await updateLocationByID(c);
})