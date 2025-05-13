import { z } from "zod";

export const addShardSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    location: z.string().optional(),
});
export type AddShardSchema = z.infer<typeof addShardSchema>;

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