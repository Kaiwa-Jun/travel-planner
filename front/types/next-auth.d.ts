import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

/**
 * session.user に独自フィールドを追加
 */
declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      provider?: string;
      providerAccountId?: string;
      backendToken?: string;
    };
  }

  interface User {
    email?: string | null;
    name?: string | null;
    image?: string | null;
    backendToken?: string;
  }
}

/**
 * token に独自フィールドを追加
 */
declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    providerAccountId?: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
    backendToken?: string;
  }
}
