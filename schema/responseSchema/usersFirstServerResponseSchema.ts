import { z } from "zod";
import { generalResponseSchema } from "./generalResponseSchema";

export const userFirstServerModule = z.object({ serverId: z.number() });
export type FooterModuleSchema = z.infer<typeof userFirstServerModule>;

export const userFirstServerResponseSchema = z
  .object({
    data: userFirstServerModule,
  })
  .merge(generalResponseSchema);
