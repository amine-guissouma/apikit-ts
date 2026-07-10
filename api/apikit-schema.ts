import { z } from "zod";


export const apikitErrorResponseSchema = z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional()
});


export const apikitBaseResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.unknown().optional(),
    error:apikitErrorResponseSchema.optional()
});

export type ApikitBaseResponse = z.infer<typeof apikitBaseResponseSchema>;
