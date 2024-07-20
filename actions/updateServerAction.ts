"use server";

import axiosInstance from "@/lib/axios-instance";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isAxiosError } from "axios";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

interface ResponseSchema {
  type: "error" | "success";
  message: string;
}
const updateServerResponseSchema = z.object({
  success: z.boolean(),
  data: z.string(),
  message: z.string(),
});
export async function updateServerAction(
  form: FormData,
  serverId: number
): Promise<ResponseSchema> {
  try {
    const session = await auth();
    if (!session) {
      return {
        type: "error",
        message: "User must be logged in",
      };
    }
    const { data } = await axiosInstance(
      session.user.jwtToken,
      "multipart/form-data"
    ).patch(`api/v1/servers/${serverId}`, form);
    const parsedData = await updateServerResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      return {
        type: "error",
        message: "Response validation error",
      };
    }
    revalidatePath("servers/:id");
    return {
      type: "success",
      message: parsedData.data.message,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (isAxiosError(error)) {
      console.log("Error Creating Server:", error.response?.data);
      return {
        message: error.response?.data.message || "",
        type: "error",
      };
    }
    return {
      message: "Something went wrong",
      type: "error",
    };
  }
}
