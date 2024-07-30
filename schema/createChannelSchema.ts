import { z } from "zod";
import { channelTypeProp } from "./responseSchema/serverResponseSchema";

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name.toLowerCase() !== "general", {
      message: "Channel name cannot be any variation of 'general'",
    }),
  type: z.nativeEnum(channelTypeProp),
});

export type CreateChannelSchema = z.infer<typeof createChannelSchema>;
