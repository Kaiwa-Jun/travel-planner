import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Next.js (App Router) のRoute Handler
const handler = NextAuth(authOptions);

/**
 * App RouterではHTTPメソッドごとにエクスポートする仕組み
 * NextAuth(handler) を GET/POST に割り当てる
 */
export { handler as GET, handler as POST };
