import { db } from "../drizzle/db";
import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as argon2 from 'argon2'
import { TimeMS, TimeSecs } from "./time.lib";
import { username } from "better-auth/plugins";
import { usernameSchema } from "../schemas/auth.schemas";
import { dateOfBirthPlugin } from "../plugins/auth/dateOfBirth";
import { userRolesPlugin } from "../plugins/auth/userRoles";
import { EmailType, type EmailSendParams } from "@backend/utils/email.utils";
import { emailQueue } from "@backend/jobs/queues/email.queue";
import { uClient } from "@backend/index";
import { COOKIE_CACHE_ENABLED, COOKIE_CACHE_MAX_AGE, ENABLE_USER_EMAIL_CHANGING, ENABLE_EMAIL_SIGNUP, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, PASSWORD_RESET_TOKEN_EXPIRE, RATE_LIMITING_ENABLED, RATE_LIMITING_MAX_REQUESTS, RATE_LIMITING_WINDOW, REQUIRE_EMAIL_VERIFICATION } from "shared/config/auth.config";
import { account, user } from "../drizzle/schema/user.schema";
import { session, verification } from '../drizzle/schema/auth.schema';
import type { TypedUser } from "../types/auth.types";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "../config/auth.config";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            verification,
            account,
        }
    }),
    plugins: [
        username({
            usernameValidator(username) {
                return  usernameSchema.safeParse(username).success;
            },
            minUsernameLength: MIN_USERNAME_LENGTH,
            maxUsernameLength: MAX_USERNAME_LENGTH,
        }),
        dateOfBirthPlugin(),
        userRolesPlugin(),
    ],
    user: {
        changeEmail: {
            enabled: ENABLE_USER_EMAIL_CHANGING,
        },
        deleteUser: {
            enabled: true,
        },
    },
    emailAndPassword: {
        enabled: ENABLE_EMAIL_SIGNUP,
        requireEmailVerification: REQUIRE_EMAIL_VERIFICATION,
        password: {
            hash: async (password: string) => await argon2.hash(password),
            verify: async (data) => await argon2.verify(data.hash, data.password),
        },
        minPasswordLength: MIN_PASSWORD_LENGTH,
        maxPasswordLength: MAX_PASSWORD_LENGTH,
        resetPasswordTokenExpiresIn: TimeSecs.hours(PASSWORD_RESET_TOKEN_EXPIRE),
    },
    emailVerification: {
        sendOnSignUp: REQUIRE_EMAIL_VERIFICATION,
        sendVerificationEmail: async ({ token, user }) => {
            await sendVerificationEmailFunc(token, user as TypedUser);
        },
    },
    session: {
        cookieCache: {
            enabled: COOKIE_CACHE_ENABLED,
            maxAge: TimeSecs.mins(COOKIE_CACHE_MAX_AGE),
        }
    },
    secondaryStorage: {
        get: async (key) => {
            const val = await uClient.cache.get(`auth:${key}`);
            return val ? val : null;
        },
        set: async (key, value, ttl) => {
            if (ttl) await uClient.cache.set(`auth:${key}`, value, "EX", ttl);
            else await uClient.cache.set(`auth:${key}`, value);
        },
        delete: async (key) => {
            await uClient.cache.del(`auth:${key}`);
        },
    },
    trustedOrigins: [
        "http://localhost:42069",
    ],
    rateLimit: {
        enabled: RATE_LIMITING_ENABLED,
        max: RATE_LIMITING_MAX_REQUESTS,
        window: RATE_LIMITING_WINDOW,
        storage: 'secondary-storage'
    }
})

async function sendVerificationEmailFunc(token: string, user: TypedUser) {
    const { email, username } = user;
    const url=`${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
            
    const emailData: EmailSendParams = {
        to: email,
        subject: `Verify your ${process.env.APP_NAME} account`,
        html: `Hello, ${username}! Click here to verify your email: <a href="${url}">${url}</a>`,
        from: process.env.SMTP_FROM,
        emailType: EmailType.EMAIL_VERIFICATION
    }

    emailQueue.addJob({
        id: `verify-email-${user.id}-${token}`,
        data: emailData,
        name: `verify-email-${user.id}`,
        options: {
            priority: 2,
            delay: TimeMS.secs(5),
            retry: {
                maxAttempts: 3,
                totalAttempts: 0,
                delay: TimeMS.secs(5),
            }
        }
    })
    return;
}