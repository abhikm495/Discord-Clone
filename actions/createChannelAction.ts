"use server";
import qs from "query-string";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { Server } from "@/schema/responseSchema/serverResponseSchema";
import { AxiosError } from "axios";
import {
  CreateChannelSchema,
  createChannelSchema,
} from "@/schema/createChannelSchema";
import { serverResponseSchema } from "@/schema/responseSchema/serverResponseSchema";
import { revalidatePath } from "next/cache";
interface ResponseSchema {
  type: "error" | "success";
  message: string;
  data?: Server;
}

export async function createChannelAction(
  serverId: number,
  channelSchema: CreateChannelSchema
): Promise<ResponseSchema> {
  try {
    console.log("serverId", serverId);
    console.log("input", channelSchema.name, channelSchema.type);

    const session = await auth();
    if (!session) {
      return {
        type: "error",
        message: "user not logged in",
      };
    }
    const reqValidation = await createChannelSchema.safeParseAsync(
      channelSchema
    );
    if (!reqValidation.success) {
      return {
        type: "error",
        message: "Request Validation error",
      };
    }

    const url = qs.stringifyUrl({
      url: `/api/v1/channels`,
      query: {
        serverId: serverId,
      },
    });

    const { data } = await axiosInstance(session.user.jwtToken).post(url, {
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
      data: parsedData.data.data.server,
    };
  } catch (error) {
    console.log("channel creation error", error);
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
