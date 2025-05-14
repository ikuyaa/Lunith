import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const SHARD_STATUS = pgEnum('shard_status', [ 'ONLINE', 'ERROR', 'OFFLINE', 'MAINTENANCE' ]);
export const SHARD_VISIBLE = pgEnum('shard_visible', ['public', 'private'])
export const shard = pgTable('shards', {
    id: text('id').primaryKey().notNull(),
    token: text('token').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    locationId: integer('locationId').notNull().references(() => shardLocation.id),
    shardVisible: SHARD_VISIBLE('shardVisible').default('private').notNull(),
    totalMemMB: integer('totalMemMB').notNull(),
    totalDiskSpaceMB: integer('totalDiskSpaceMB').notNull(),
    totalCPUCores: integer('totalCPUCores').notNull(),
    daemonFileDirectory: text('daemonFileDirectory').notNull(),
    maxFileUploadSizeMB: integer('maxFileUploadSizeMB').notNull().default(100),
    ipAddress: text('ipAddress'),
    ipv4Address: text('ipv4Address'),
    status: SHARD_STATUS('status').notNull().default('OFFLINE'),
    createdBy: text('createdBy').notNull().references(() => user.id),
    createdAt: timestamp('createdAt', {mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const shardRelations = relations(shard, ({ one }) => ({
    locations: one(shardLocation, {
        fields: [shard.locationId],
        references: [shardLocation.id],
    }),
    createdBy: one(user, {
        fields: [shard.createdBy],
        references: [user.id],
    }),
}));

//Add servers to this later.
export const shardLocation = pgTable('shard_locations', {
    id: serial('id').primaryKey().notNull(),
    location: text('name').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('createdAt', {mode: 'date'}).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).notNull().defaultNow().$onUpdate(() => new Date()),   
});

export const shardLocationRelations = relations(shardLocation, ({ many }) => ({    
    shards: many(shard),
}));