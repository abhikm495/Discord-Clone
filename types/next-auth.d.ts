import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      jwtToken?: string;
      refreshToken?: string;
      // };
    } & DefaultSession["user"];
  }

  interface User {
    jwtToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */

    jwtToken?: string;
    refreshToken?: string;
    id: string;
  }
}
