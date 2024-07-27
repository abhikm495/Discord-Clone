import { z } from "zod";
import { generalResponseSchema } from "./generalResponseSchema";

const profileSchema = z.object({
  userId: z.number(),
  name: z.string(),
  imageUrl: z.string(),
  email: z.string().email(),
});
export enum channelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}
export enum memberRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}
export const MemberRole = z.enum(["ADMIN", "MODERATOR", "GUEST"]);
const memberSchema = z.object({
  id: z.number(),
  role: MemberRole,
  profileId: z.number(),
  serverId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  profile: profileSchema,
});

const ChannelType = z.enum(["TEXT", "AUDIO", "VIDEO"]);
const channelSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: ChannelType,
  profileId: z.number(),
  serverId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
const serverSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  name: z.string(),
  imageUrl: z.string(),
  inviteCode: z.string(),
  channels: z.array(channelSchema),
  members: z.array(memberSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const serverModuleSchema = z.object({
  server: serverSchema,
});

const serverResponseDataSchema = z.object({
  data: serverModuleSchema,
});

export const serverResponseSchema = generalResponseSchema.merge(
  serverResponseDataSchema
);

export type Server = z.infer<typeof serverSchema>;
export type ServerResponse = z.infer<typeof serverResponseSchema>;
