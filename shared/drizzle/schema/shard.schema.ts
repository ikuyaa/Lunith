import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import uniqid from 'uniqid';

export const SHARD_STATUS = pgEnum('shard_status', [ 'ONLINE', 'ERROR', 'OFFLINE', 'MAINTENANCE' ]);

export const shard = pgTable('shards', {
    id: text('id').primaryKey().notNull().default(uniqid()),
    token: text('token').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    ipAddress: text('ipAddress'),
    ipv4Address: text('ipv4Address'),
    status: SHARD_STATUS('status').notNull().default('OFFLINE'),
    createdAt: timestamp('createdAt', {mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const shardRelations = relations(shard, ({ many }) => ({
    locations: many(shardLocation),
}));

//Add servers to this later.
export const shardLocation = pgTable('shard_locations', {
    id: serial('id').primaryKey().notNull(),
    location: text('name').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('createdAt', {mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).notNull().defaultNow().$onUpdate(() => new Date()),   
})

export const shardLocationRelations = relations(shardLocation, ({ many }) => ({    
    shards: many(shard),
}))