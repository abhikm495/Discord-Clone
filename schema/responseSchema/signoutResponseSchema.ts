import { z } from "zod";

export const SignoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
