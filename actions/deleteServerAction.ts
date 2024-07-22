"use server";
import qs from "query-string";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { z } from "zod";
import { revalidatePath } from "next/cache";
interface ResponseSchema {
  type: "error" | "success";
  message: string;
}
const leaveServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.string(),
});

export async function deleteServerAction(
  serverId: number
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
      url: `/api/v1/servers/${serverId}`,
    });

    const { data } = await axiosInstance(session.user.jwtToken).delete(url);

    const parsedData = await leaveServerResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      return {
        type: "error",
        message: "response validation error",
      };
    }
    revalidatePath("/");
    return {
      type: "success",
      message: parsedData.data.message,
    };
  } catch (error) {
    console.log("delete server error", error);
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
