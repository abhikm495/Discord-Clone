"use server";

import { auth, signOut } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import { SignoutResponseSchema } from "@/schema/responseSchema/signoutResponseSchema";
interface ResponseSchema {
  type: "error" | "success";
  message: string;
}

export async function signoutAction(): Promise<ResponseSchema | void> {
  try {
    const session = await auth();
    if (!session) {
      return {
        type: "error",
        message: "user not logged in",
      };
    }
    // const { data } = await axiosInstance(session.user.jwtToken).post(
    //   "api/v1/auth/signout"
    // );

    // const signoutResponse = await SignoutResponseSchema.safeParseAsync(data);
    // if (!signoutResponse.success) {
    //   return {
    //     type: "error",
    //     message: "Response validation error",
    //   };
    // }
    await signOut();

    redirect("/sign-in");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (isAxiosError(error)) {
      console.log("Error Signing Up:", error.response?.data);
      return {
        message: error.response?.data.message || "",
        type: "error",
      };
    }

    console.log("errror");
    console.log(error);

    return {
      message: "Something went wrong",
      type: "error",
    };
  }
}
