import { z } from 'zod'
import { generalResponseSchema } from './generalResponseSchema'
import { channelSchema, memberSchema } from './serverResponseSchema'

export type MemberResponseSchema = z.infer<typeof memberSchema>

export const memberResponseSchema = z
  .object({
    data: z.object({
      member: memberSchema,
    }),
  })
  .merge(generalResponseSchema)
