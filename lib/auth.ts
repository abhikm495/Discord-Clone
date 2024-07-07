import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import axiosInstance from "./axios-instance";
import { AxiosError } from "axios";
import { loginResponseSchema } from "@/schema/responseSchema/loginResponseSchema";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (credentials?.jwtToken) {
          return credentials;
        }
        try {
          const { data } = await axiosInstance("").post(
            "api/v1/auth/signin",
            credentials
          );
          const loginResponse = await loginResponseSchema.safeParseAsync(data);
          if (!loginResponse.success) {
            return null;
          }
          return {
            jwtToken: loginResponse.data.jwttoken,
            refreshToken: loginResponse.data.refreshtoken,
            ...loginResponse.data.user,
          };
        } catch (error) {
          if (error instanceof AxiosError) {
            console.log(error.response?.data, "login error");
            return null;
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwtToken = user.jwtToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.jwtToken = token.jwtToken;
      session.user.refreshToken = token.refreshToken;
      session.user.id = token.id;
      return session;
    },
  },
});
