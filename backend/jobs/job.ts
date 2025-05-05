import { Log } from "@shared/lib/logger.lib";
import { emailWorker } from "./workers/email-worker";
import type { JobWorker } from "./classes/worker";
import { TimeMS } from "@shared/lib/time.lib";

type Worker = {
    name: string;
    instance: JobWorker<any>;
}

const workers: Worker[] = [
    { name: 'EmailWorker', instance: emailWorker },
]

export function startWorkers() {
    for(const worker of workers) {
        spawnWorker(worker.name, worker.instance);
        Log.info(`Starting worker: ${worker.name}`);
    }
}

async function spawnWorker(name: string, worker: JobWorker<any>) {
    async function start() {
        try {
            await worker.start(name);
        } catch (err) {
            Log.error(`Worker ${name} failed: `, err as Error);
            setTimeout(() => start(), TimeMS.secs(30)); //Restart after 30 seconds
        }
    }
    start();
}