import { Log } from "@shared/lib/logger.lib";
import Redis from "ioredis";

export function createRedisClient() {
    const client = new Redis({
        host: process.env.REDIS_IP,
        port: process.env.REDIS_PORT,
    });

    client.on("error", (err) => { 
        Log.error(`Redis Error`, err as Error)
    });

    return client;
}