import { z } from "zod";

export const loginResponseSchema = z.object({
  jwttoken: z.string().min(1),
  refreshtoken: z.string().min(1),
  user: z.object({
    id: z.number(),
    name: z.string().min(1),
    email: z.string().email(),
    image: z.string().url(),
  }),
});

export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;
