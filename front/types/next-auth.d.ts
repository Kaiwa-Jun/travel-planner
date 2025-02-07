import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

/**
 * session.user に独自フィールドを追加
 */
declare module "next-auth" {
  interface Session {
    user?: {
      // 既存フィールド
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // カスタム
      provider?: string;
      providerAccountId?: string;
    };
  }
}

/**
 * token に独自フィールドを追加
 */
declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    providerAccountId?: string;
    picture?: string;
  }
}
