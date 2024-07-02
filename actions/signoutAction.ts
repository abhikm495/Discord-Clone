"use server";

import { auth, signOut } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { SignoutResponseSchema } from "@/schema/responseSchema/signoutResponseSchema";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isAxiosError } from "axios";
/*
 * TODO: Implement rate limiting
 * REFERENCES: https://github.com/vercel/next.js/blob/canary/examples/api-routes-rate-limit/pages/api/user.ts
 * REFERENCES: https://stackoverflow.com/questions/78006979/how-can-control-rate-limit-in-next-js-14
 */

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
    console.log(session);

    const { data } = await axiosInstance(session.user.jwtToken).post(
      "api/v1/auth/signout",
      {}
    );

    const signoutResponse = await SignoutResponseSchema.safeParseAsync(data);
    if (!signoutResponse.success) {
      return {
        type: "error",
        message: "Response validation error",
      };
    }
    await signOut();

    // redirect("/login");
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
