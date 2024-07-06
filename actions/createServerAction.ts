"use server";

import axiosInstance from "@/lib/axios-instance";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import { auth } from "@/lib/auth";

interface ResponseSchema {
  type: "error" | "success";
  message: string;
}

export async function createServerAction(
  form: FormData
): Promise<ResponseSchema | void> {
  try {
    const session = await auth();
    if (!session) {
      return {
        type: "error",
        message: "User must be logged in",
      };
    }
    const { data } = await axiosInstance(session.user.jwtToken).post(
      "api/v1/servers",
      form
    );
    redirect("/");
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
