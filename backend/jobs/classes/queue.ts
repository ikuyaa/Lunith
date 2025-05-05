import crypto from "node:crypto";
import type { Job, OptionalJobOptions, QueueOptions } from "@shared/types/jobs.types";
import { TimeMS } from "@shared/lib/time.lib";


/**
 * Abstract Queue class for managing jobs of type T.
 * Handles job addition, retry logic, and enforces implementation of job storage and retrieval.
 * @template T - The type of job data handled by the queue.
 */
export abstract class Queue<T> {
    /** The name of the queue. */
    protected queueName: string;
    /** Queue options such as retry attempts and delay. */
    protected options: QueueOptions;

    /**
     * Constructs a new Queue instance.
     * @param queueName - The name of the queue.
     * @param options - Optional queue options (retryAttempts, retryDelay).
     */
    constructor(queueName: string, options: QueueOptions = { retryAttempts: 5, retryDelay: TimeMS.secs(3) }) {
        this.queueName = queueName;
        this.options = options;
    }

    /**
     * Adds a job to the queue with retry and delay options.
     * @param job - The job to add (without id and options, but with optional id and options).
     * @returns The job id.
     */
    async addJob(job: Omit<Job<T>, "id" | "options"> & { options?: OptionalJobOptions, id: string }) {
        // Generate a unique id if not provided
        const id = job.id || crypto.randomUUID();
        // If retry is not enabled or max attempts reached, return id without adding
        if((job.options?.retry?.totalAttempts ?? 0) >= (job.options?.retry?.maxAttempts ?? 1)) {
            return id;
        }

        // Push the job to the queue with merged options
        await this.push({
            ...job,
            id,
            options: {
                delay: job.options?.delay ?? 0,
                priority: job.options?.priority ?? 0,   
                retry: {

                    totalAttempts: job.options?.retry?.totalAttempts ?? 0,
                    maxAttempts: job.options?.retry?.maxAttempts ?? this.options.retryAttempts,
                    delay: job.options?.retry?.delay ?? this.options.retryDelay
                }
            }
        })
    }

    /**
     * Abstract method to push a job to the queue storage.
     * Must be implemented by subclasses.
     * @param job - The job to push, with required retry options.
     */
    protected abstract push(job: Job<T> & { options: { retry: Required<Job<T>["options"]["retry"]> } }) : Promise<unknown>;

    /**
     * Abstract method to get or wait for a job from the queue.
     * Must be implemented by subclasses.
     * @returns The next job or null if none available.
     */
    abstract getOrWaitForJob() : Promise< | (Job<T> & { options: { retry: Required<Job<T>["options"]["retry"]> } }) | null>;

    /**
     * Abstract getter for the current queue length.
     * Must be implemented by subclasses.
     */
    abstract get length(): Promise<number>;
}