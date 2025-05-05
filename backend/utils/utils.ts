import type Redis from "ioredis";
import { createRedisClient } from "./redis.utils";

export interface uClient {
    cache: Redis
}

export function initUtilsClient(){
    const client: uClient = {
        cache: createRedisClient(),

    }

    return client;
}