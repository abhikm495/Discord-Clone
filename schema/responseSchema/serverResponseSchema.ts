import { z } from "zod";
import { generalResponseSchema } from "./generalResponseSchema";

const profileSchema = z.object({
  id: z.string(),
  userId: z.number(),
  name: z.string(),
  imageUrl: z.string(),
  email: z.string().email(),
});

export const MemberRole = z.enum(["ADMIN", "MODERATOR", "GUEST"]);
const memberSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  serverId: z.number(),
  role: MemberRole,
  profile: profileSchema,
});

export const ChannelType = z.enum(["TEXT", "AUDIO", "VIDEO"]);

const channelSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  serverId: z.number(),
  name: z.string(),
  type: ChannelType,
});

const serverSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  name: z.string(),
  imageUrl: z.string(),
  inviteCode: z.string(),
  channels: z.array(channelSchema),
  members: z.array(memberSchema),
});

export const serverModule = z.object({
  server: serverSchema,
});

export type ServerModuleSchema = z.infer<typeof serverModule>;

export const serverResponseSchema = z
  .object({
    data: serverModule,
  })
  .merge(generalResponseSchema);
export type ServerResponse = z.infer<typeof serverResponseSchema>;
