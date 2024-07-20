"use server";
import qs from "query-string";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { Server } from "@/schema/responseSchema/serverResponseSchema";
import { AxiosError } from "axios";

import { serverResponseSchema } from "@/schema/responseSchema/serverResponseSchema";
interface ResponseSchema {
  type: "error" | "success";
  message: string;
  data?: Server;
}

export async function updateMember(
  memberId: number,
  serverId: number,
  role: "GUEST" | "MODERATOR"
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
      url: `/api/v1/servers/members/${memberId}`,
      query: {
        serverId: serverId,
      },
    });

    const { data } = await axiosInstance(session.user.jwtToken).patch(url, {
      role,
    });

    const parsedData = await serverResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      return {
        type: "error",
        message: "response validation error",
      };
    }
    return {
      type: "success",
      message: parsedData.data.message,
      data: parsedData.data.data.server,
    };
  } catch (error) {
    console.log("update member error", error);
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
