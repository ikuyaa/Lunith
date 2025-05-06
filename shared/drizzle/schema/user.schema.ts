import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { session } from "./auth.schema";

const userRoleValues = [ 
    "BASE_USER", 
    "SUBSCRIBER", 
    "CUSTOMER_SUPPORT", 
    "MODERATOR", 
    "ADMIN", 
    "ROOT" 
];

export const UserRoles = pgEnum('userRole',[ 
    "BASE_USER", 
    "SUBSCRIBER", 
    "CUSTOMER_SUPPORT", 
    "MODERATOR", 
    "ADMIN", 
    "ROOT" 
]);
export type UserRole = typeof UserRoles.enumValues[number]; 

export const UserRoleObject = Object.fromEntries(UserRoles.enumValues.map(role => [role, role]));


export const user = pgTable('user', {
    id: text('id').primaryKey().notNull().unique(),
    name: text('name').notNull(),
    username: text('username').notNull().unique(),
    displayUsername: text('displayUsername'),
    userRole: UserRoles('userRole').default('BASE_USER').notNull(),
    dateOfBirth: timestamp('dateOfBirth', { mode: 'date' }).notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').default(false),
    image: text('image'),
    createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).defaultNow().notNull().$onUpdate(() => new Date()),  
});

export const userRelations = relations(user, ({ many }) => ({
    accounts: many(account),
    sessions: many(session),
}));

export const account = pgTable('account', { 
    id: text('id').primaryKey().notNull(),
    userId: text('userId').notNull().references(() => user.id, {onDelete: 'cascade'}),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    idToken: text('idToken'),
    password: text('password'),
    createdAt: timestamp('createdAt', {mode: 'date'}).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', {mode: 'date'}).defaultNow().notNull().$onUpdate(() => new Date()),
});

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    })
}));