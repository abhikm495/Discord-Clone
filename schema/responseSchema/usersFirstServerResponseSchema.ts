import { z } from "zod";
import { generalResponseSchema } from "./generalResponseSchema";
import { channelSchema } from "./serverResponseSchema";

export const userFirstServerModule = channelSchema;
export type FooterModuleSchema = z.infer<typeof userFirstServerModule>;

export const userFirstServerResponseSchema = z
  .object({
    data: userFirstServerModule,
  })
  .merge(generalResponseSchema);
