import { z } from 'zod'
import { generalResponseSchema } from './generalResponseSchema'
import { channelSchema } from './serverResponseSchema'

export type ChannelResponseSchema = z.infer<typeof channelSchema>

export const channelResponseSchema = z
  .object({
    data: z.object({
      channel: channelSchema,
    }),
  })
  .merge(generalResponseSchema)
