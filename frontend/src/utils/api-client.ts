import type { APIRoutes } from "@backend/index";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "@shared/constants/status-codes.conastants";
import type { AddShardLocationSchema } from "@shared/schemas/shard.schemas";
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
            if(error.includes('Location already exists')) {
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