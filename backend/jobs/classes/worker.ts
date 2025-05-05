import { TimeMS } from "@shared/lib/time.lib";
import type { Job } from "@shared/types/jobs.types";
import type { Queue } from "./queue";
import { Log } from "@shared/lib/logger.lib";

let workers = 0;

/**
 * Worker class for processing jobs from a queue with concurrency control.
 * @template T - The type of job data handled by the worker.
 */
export class JobWorker<T> {
    private id = workers++ + 1;
    /** The queue to process jobs from. */
    private queue: Queue<T>;
    /** Function to process a single job. */
    private processJob: (job: Job<T>) => Promise<void>; // Function to process the job  
    /** Maximum number of concurrent jobs. */
    private concurrency;
    /** Map of active job ids to their processing promises. */
    private activeJobs: Map<string, Promise<void>> = new Map();

    /**
     * Constructs a new Worker instance.
     * @param queue - The queue to process jobs from.
     * @param processJob - The function to process each job.
     * @param options - Optional concurrency setting (default 1).
     */
    constructor(queue: Queue<T>, processJob: (job: Job<T>) => Promise<void>, {concurrency = 1} = {}) {
        this.processJob = processJob;
        this.queue = queue;
        this.concurrency = concurrency;
    }  
    
    /**
     * Starts the worker loop to continuously process jobs from the queue.
     * Handles retry logic and concurrency.
     */
    async start(workerName: string) {
        Log.info(`Worker ${workerName} (ID: ${this.id}) started with concurrency ${this.concurrency}`);    
        while(true) {
            // Get the next job or wait if none available
            const job = await this.queue.getOrWaitForJob();
            if(job === null) {
                // Wait before polling again if no job is available
                await new Promise(resolve => setTimeout(resolve, TimeMS.secs(15)));
            } else {
                // Process the job and handle retries on failure
                this.activeJobs.set(
                    job.id,
                    this.processJob(job)
                    .catch(async () => {
                        // On failure, re-add the job with incremented attempt count and exponential backoff delay
                        await this.queue.addJob({
                            ...job,
                            options: {
                                ...job.options,
                                retry: {
                                    ...job.options.retry,
                                    totalAttempts: job.options.retry.totalAttempts + 1
                                },
                                delay: job.options.retry.delay * job.options.retry.totalAttempts ** 2,
                            },
                        });
                    }).finally(() => {
                        this.activeJobs.delete(job.id);
                    })
                )
            }

            // If concurrency limit reached, wait for any job to finish
            if(this.activeJobs.size >= this.concurrency) {
                await Promise.any(this.activeJobs.values())
            }
        }
    }
}