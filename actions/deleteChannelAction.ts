"use server";
import qs from "query-string";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { generalResponseSchema } from "@/schema/responseSchema/generalResponseSchema";
interface ResponseSchema {
  type: "error" | "success";
  message: string;
}

export async function deleteChannelAction(
  serverId: number,
  channelId: number
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

    const { data } = await axiosInstance(session.user.jwtToken).delete(url);

    const parsedData = await generalResponseSchema.safeParseAsync(data);
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
    };
  } catch (error) {
    console.log("delete member error", error);
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
