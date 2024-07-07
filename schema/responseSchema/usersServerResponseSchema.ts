import { z } from "zod";
import { generalResponseSchema } from "./generalResponseSchema";

const serverSchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().url(),
  inviteCode: z.string().uuid(),
  profileId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const userServersResponseSchema = generalResponseSchema.extend({
  data: z.object({
    servers: z.array(serverSchema),
  }),
});

export type UserServersResponse = z.infer<typeof userServersResponseSchema>;
