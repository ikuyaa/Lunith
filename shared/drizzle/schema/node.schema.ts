import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import uniqid from 'uniqid';

export const NODE_STATUS = pgEnum('node_status', [ 'ONLINE', 'ERROR', 'OFFLINE', 'MAINTENANCE' ]);

export const node = pgTable('nodes', {
    id: text('id').primaryKey().notNull().default(uniqid()),
    token: text('token').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    location: text('location'),
    ipAddress: text('ipAddress'),
    ipv4Address: text('ipv4Address'),
    status: NODE_STATUS('status').notNull().default('OFFLINE'),
    createdAt: timestamp('createdAt', {mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).notNull().defaultNow().$onUpdate(() => new Date()),
})