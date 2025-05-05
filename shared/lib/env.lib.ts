import { z } from "zod";

const envVariables = z.object({
    PORT: z.coerce.number(),
    APP_NAME: z.string(),
    FRONTEND_URL: z.string(),
    DATABASE_URL: z.string(),
    BETTTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_IP: z.string(),
    REDIS_URL: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),
    SHARD_JWT_SECRET: z.string(),


});

envVariables.parse(process.env);

declare module "bun" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Env extends z.infer<typeof envVariables> {}
}