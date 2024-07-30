import { z } from 'zod'
import { generalResponseSchema } from './generalResponseSchema'
import { channelSchema } from './serverResponseSchema'

const serverSchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string().url(),
  inviteCode: z.string().uuid(),
  profileId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  channels: z.array(channelSchema),
})

export const userServersResponseSchema = generalResponseSchema.extend({
  data: z.object({
    servers: z.array(serverSchema),
  }),
})

export type UserServersResponse = z.infer<typeof userServersResponseSchema>
