import { z } from "zod";

export const generalResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type GeneralResponseSchema = z.infer<typeof generalResponseSchema>;
