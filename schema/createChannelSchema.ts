import { z } from "zod";

enum ChannelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name.toLowerCase() !== "general", {
      message: "Channel name cannot be any variation of 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

export type CreateChannelSchema = z.infer<typeof createChannelSchema>;
