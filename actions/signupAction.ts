"use server";

import axiosInstance from "@/lib/axios-instance";
// import { GeneralResponseSchema } from "@/schema/generalResponseSchema";
// import { signupResponseSchema } from "@/schema/responseSchema/signupResponseSchema";
import { SignUpSchema, signUpSchema } from "@/schema/signupSchema";

import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
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

export async function signupAction(
  form: FormData
  //   croppedImage: File | null
): Promise<ResponseSchema | void> {
  try {
    const { data } = await axiosInstance("", "multipart/form-data").post(
      "api/v1/auth/signup",
      form
    );
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
    return {
      message: "Something went wrong",
      type: "error",
    };
  }
}
