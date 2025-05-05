export type JobOptions = {
    delay: number
    priority: number
    retry: {
        totalAttempts: number
        maxAttempts: number
        delay: number
    }
}

export type QueueOptions = {
    retryAttempts: number
    retryDelay: number
}

export type OptionalJobOptions = Partial<JobOptions> & {
    retry?: Partial<JobOptions["retry"]>
}

export type Job<T> = {
    id: string
    name: string
    data: T
    options: JobOptions
}