import type { APIRoutes } from "@backend/index";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "@shared/constants/status-codes.conastants";
import type { AddShardLocationSchema } from "@shared/schemas/shard.schemas";
import type { ShardLocation } from "@shared/types/shard.types";
import { hc } from "hono/client";

export const apiClient = hc<APIRoutes>("/");

export async function createShardLocation(data: AddShardLocationSchema) {
    const json = JSON.parse(JSON.stringify(data))
    console.log("Creating shard location with data:", json);
    const response = await apiClient.api.shard.location.create.$post({
        json,
        headers: {
            "Content-Type": "application/json",
        }
    });

    const { message, error } = await response.json();

    switch (response.status) {
        case OK:
            return message;
        case BAD_REQUEST: {
            if(error?.includes('Location already exists')) {
                throw new Error('Location already exists');
            } else {
                throw new Error('Location is required');
            }
        }
        case INTERNAL_SERVER_ERROR: {
            throw new Error('Error creating location in database');
        }
        default:
            throw new Error('Unknown error creating location');
    }


}

export async function getShardLocations() {
    const res = await apiClient.api.shard.location.all.$get({
        headers: {
            "Content-Type": "application/json",
        }
    });

    const { message, error } = await res.json();
    
    if(error) {
        throw new Error(error);
    }

    if(message) {
        const shardLocations = (message as unknown as (ShardLocation & { shardCount: number })[]).map(loc => ({
            ...loc,
            createdAt: new Date(loc.createdAt),
            updatedAt: new Date(loc.updatedAt),
        }));

        return shardLocations;
    }

    return null;
}

export async function deleteShardLocationById(locationId: string) {
    const res = await apiClient.api.shard.location.delete[":locationId"].$delete({
        param: { locationId }
    });

    const { message, error } = await res.json();

    if(error) {
        throw new Error(error);
    }

    if(message) {
        return message;
    }

    return null;
}

export async function deleteMultipleShardLocationsById(locationIds: string[]) {
    const res = await apiClient.api.shard.location.delete.multiple[":locationIds"].$delete({
        param: { locationIds: locationIds.join(',') }
    });

    const { message, error } = await res.json();
    
    if(error) {
        throw new Error(error);
    }

    if(message) {
        return message;
    }
}

export async function updateShardLocationById(locationId: string, data: AddShardLocationSchema) {
    try {
        const res = await apiClient.api.shard.location.update.$post({
            json: {
                locationId,
                ...data
            },
            header: {
                "Content-Type": "application/json",
            },
        })

        const { message, error } = await res.json();

        if(error) {
            throw new Error(error);
        }

        if(message) {
            return message;
        }

        return null;
    } catch (error: any) {
        throw new Error(error.message as string);
    }
}