"use server";
import qs from "query-string";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import {
  Server,
  serverResponseSchema,
} from "@/schema/responseSchema/serverResponseSchema";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { CreateChannelSchema } from "@/schema/createChannelSchema";
interface ResponseSchema {
  type: "error" | "success";
  message: string;
  server?: Server;
}

export async function editChannelAction(
  serverId: number,
  channelId: number,
  channelSchema: CreateChannelSchema
): Promise<ResponseSchema> {
  try {
    const session = await auth();
    if (!session) {
      return {
        type: "error",
        message: "user not logged in",
      };
    }
    const url = qs.stringifyUrl({
      url: `/api/v1/channels/${channelId}`,
      query: {
        serverId: serverId,
      },
    });

    const { data } = await axiosInstance(session.user.jwtToken).patch(url, {
      name: channelSchema.name,
      type: channelSchema.type,
    });

    const parsedData = await serverResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      return {
        type: "error",
        message: "response validation error",
      };
    }
    revalidatePath("servers/:id");
    return {
      type: "success",
      message: parsedData.data.message,
      server: parsedData.data.data.server,
    };
  } catch (error) {
    console.log("edit channel error", error);
    if (error instanceof AxiosError) {
      return {
        type: "error",
        message: error.response?.data.message,
      };
    }
    return {
      message: "Something went wrong",
      type: "error",
    };
  }
}
