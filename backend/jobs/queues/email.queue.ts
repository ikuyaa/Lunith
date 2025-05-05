import type { EmailSendParams } from "backend/utils/email.utils";
import { RedisQueue } from "../classes/redis-queue";
import { TimeMS } from "@shared/lib/time.lib";

export const emailQueue = new RedisQueue<EmailSendParams>(process.env.REDIS_URL, "email-queue", {
    retryAttempts: 3,
    retryDelay: TimeMS.secs(3),
});