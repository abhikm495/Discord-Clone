"use server";

import { signIn } from "@/lib/auth";
import { LoginResponseSchema } from "@/schema/responseSchema/loginResponseSchema";

const refreshJWT = async (data: LoginResponseSchema) => {
  try {
    await signIn("credentials", {
      jwtToken: data.jwttoken,
      refreshToken: data.refreshtoken,
      ...data.user,
    });
  } catch (error) {}
};

export default refreshJWT;
