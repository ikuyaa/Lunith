import Email from "backend/utils/email.utils";
import { JobWorker } from "../classes/worker";
import { emailQueue } from "../queues/email.queue";
import { Log } from "@shared/lib/logger.lib";


export const emailWorker = new JobWorker(
    emailQueue, async job => {
        Log.info(`Starting job ${job.name}`)
        await Email.sendEmail(job.data);
    },
    {concurrency: 3} //Runs 3 jobs at a time
)