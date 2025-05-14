import { z } from "zod";

export const createShardSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    locationId: z.string().optional().transform((val) => Number(val)).refine((val) => !isNaN(val), { message: "Location ID must be a number" }),
    shardVisible: z.enum(["public", "private"], { message: "Shard visibility is required" }).default('private'),
    totalMemMB: z.number().min(1, { message: "Total Memory is required" })
        .max(100000, { message: "Total Memory must be less than 100000 MB" }),
    totalDiskSpaceMB: z.number().min(1, { message: "Total Disk Space is required" })
        .max(50000000, { message: "Total Disk Space must be less than 50,000,000 MB" }),
    totalCPUCores: z.number().min(1, { message: "Total CPU Cores is required" })
        .max(1000, { message: "Total CPU Cores must be less than 1000" }),
    daemonFileDirectory: z.string().min(1, { message: "Daemon File Directory is required" })
        .max(1000, { message: "Daemon File Directory must be less than 1000 characters" })
        .default('/var/lib/lunith/volumes'),
    
    
});
export type CreateShardSchema = z.infer<typeof createShardSchema>;

export const addShardLocationSchema = z.object({
    location: z.string().min(1, { message: "Location is required" })
    .max(64, { message: "Location must be less than 64 characters" }).optional(),
    description: z.string().max(244, { message: "Message cannot be longer then 244 characters." }).optional(),
});
export type AddShardLocationSchema = z.infer<typeof addShardLocationSchema>;

export const editShardLocationSchema = z.object({
    location: z.string().min(1, { message: "Location is required" }).max(64, { message: "Location must be less than 64 characters" }),
    description: z.string().max(244, { message: "Message cannot be longer then 244 characters." }).optional(),
}).refine((data) => data.location || data.description, {
    message: "At least one field is required",   
});
export type EditShardLocationSchema = z.infer<typeof editShardLocationSchema>;

//API Request Schemas
export const editShardLocationRequestSchema = z.object({
    locationId: z.string()
        .min(1, { message: "Location ID is required" })
        .max(1000, { message: "Location ID must be less than 1000 characters" })
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Location ID must be a number" }),
    location: z.string().min(1, { message: "Location is required" }).max(64, { message: "Location must be less than 64 characters" }),
    description: z.string().max(244, { message: "Message cannot be longer then 244 characters." }).optional(),
});

export const createShardLocationRequestSchema = z.object({
    location: z.string().min(1, { message: "Location is required" })
        .max(64, { message: "Location must be less than 64 characters" }),
    description: z.string().max(244, { message: "Message cannot be longer then 244 characters." }).optional(),
});

export const deleteShardLocationRequestSchema = z.object({
    locationId: z.string()
        .min(1, { message: "Location ID is required" })
        .max(1000, { message: "Location ID must be less than 1000 characters" })
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Location ID must be a number" }),
});