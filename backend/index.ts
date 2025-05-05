import { Hono } from "hono";
import { initUtilsClient } from "./utils/utils";
import type { HonoContext } from "@shared/types/hono-ctx";
import { logger } from "hono/logger";
import { startWorkers } from "./jobs/job";
import { validSessionCheck } from "./middleware/auth.middleware";
import { auth } from "@shared/lib/auth.lib";
import { serveStatic } from "hono/bun";
import { websocket, websocketApp } from "./websockets/websockets";
import { serve } from "bun";
import { Log } from "@shared/lib/logger.lib";

const app = new Hono<HonoContext>();
app.use("*", logger());

//Starting the workers
startWorkers();

//Init Utils Client
export const uClient = initUtilsClient();

//Routing the websocket app
app.route('/', websocketApp);

//Middleware
validSessionCheck(app);

//Routes
/* eslint-disable @typescript-eslint/no-unused-vars */
const apiRoutes = app.basePath('/api')
.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))

//Serve the frontend app
app.get('*', serveStatic({ root: '../.dist/frontend/' }));
app.get('*', serveStatic({ path: '../.dist/frontend/index.html' }));

serve({
    fetch: app.fetch,
    port: process.env.PORT || 4200,
    websocket
});

Log.info(`Server started on http://localhost:${process.env.PORT || 4200}`);

export type APIRoutes = typeof apiRoutes;