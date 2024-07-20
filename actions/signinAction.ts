"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { SignInSchema, signInSchema } from "@/schema/signinSchema";
import { AuthError } from "next-auth";

export async function signInAction(signInData: SignInSchema) {
  try {
    const parsedData = await signInSchema.safeParseAsync(signInData);
    if (!parsedData.success) {
      return {
        type: "error",
        message: "Request validation error",
      };
    }
    await signIn("credentials", {
      ...signInData,
      redirect: false,
    });
    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials.", type: "error" };
        default: {
          return { message: error.message, type: "error" };
        }
      }
    }
    return {
      message: "Something went wrong",
      type: "error",
    };
  }
}
