"use server";

import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface ResponseSchema {
  type: "error" | "success";
  message: string;
  data: string;
}
const updateInviteCodeResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.string(),
});

export async function updateInviteCode(
  serverId: number
): Promise<ResponseSchema> {
  try {
    const session = await auth();
    if (!session) {
      return {
        type: "error",
        message: "user not logged in",
        data: "",
      };
    }
    const { data } = await axiosInstance(session.user.jwtToken).patch(
      `api/v1/servers/${serverId}/invite-code`
    );

    const parsedData = await updateInviteCodeResponse.safeParseAsync(data);
    if (!parsedData.success) {
      return {
        type: "error",
        message: "response validation error",
        data: "",
      };
    }
    revalidatePath("/server/:id");
    return {
      type: "success",
      message: parsedData.data.message,
      data: parsedData.data.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        type: "error",
        message: error.response?.data.message,
        data: "",
      };
    }
    return {
      message: "Something went wrong",
      type: "error",
      data: "",
    };
  }
}
