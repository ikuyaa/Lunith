import { WSCommands } from "@shared/constants/ws-commands.constants";
import { Log } from "@shared/lib/logger.lib";
import type { HonoContext } from "@shared/types/hono-ctx";
import type { ServerWebSocket } from "bun";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import type { WSContext } from "hono/ws";



export const { upgradeWebSocket, websocket  } = createBunWebSocket<ServerWebSocket>();

export const websocketApp = new Hono<HonoContext>()
.get('/ws', upgradeWebSocket(() => {
    return {
        async onMessage(evt, ws) {
            const data = JSON.parse(evt.data as string);
            switch(data.command) {
                case WSCommands.NODE_ATTEMPT_CONNECTION: {
                    onShardConnection(data, ws)
                    break;
                }
                case WSCommands.NODE_DISCONNECT: {
                    onShardDisconnection(data.id);
                    break;
                }
            }  
        },
    }
}))

//The map for all the node connections.
export const shardConnections = new Map<string, WSContext<ServerWebSocket<undefined>>>();

export async function onShardConnection(data: any, ws: WSContext<ServerWebSocket<undefined>>) {

}

async function onShardDisconnection(nodeId: string) {

    shardConnections.delete(nodeId);
    Log.info(`Node ${nodeId} disconnected.`);
}