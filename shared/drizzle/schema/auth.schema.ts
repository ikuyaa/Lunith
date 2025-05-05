import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { relations } from "drizzle-orm";


export const session = pgTable('session', {
    id: text('id').primaryKey().notNull(),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade'}),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expiresAt').notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),   
    updatedAt: timestamp('updatedAt', {mode: 'date'}).defaultNow().notNull().$onUpdate(() => new Date()),
});

export const sessionRelations = relations(session, ({ one }) => ({  
    user: one(user, {   
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const verification = pgTable('verification', {   
    id: text('id').primaryKey().notNull(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).defaultNow().notNull().$onUpdate(() => new Date()),
});





