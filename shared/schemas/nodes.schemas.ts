import { z } from "zod";

export const addNodeSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    location: z.string().optional(),
})
export type AddNodeSchema = z.infer<typeof addNodeSchema>;