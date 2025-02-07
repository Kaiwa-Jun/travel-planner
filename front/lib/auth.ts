import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  // OAuthプロバイダ設定
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // 初回ログイン時にOAuth情報をtokenに格納する
      if (account && profile) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.email = profile.email;
        token.name = profile.name || profile.email?.split("@")[0];
        token.picture = (profile as { picture?: string }).picture;
      }
      return token;
    },
    async session({ session, token }) {
      // session.user に必要な情報を格納
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.picture,
          provider: token.provider,
          providerAccountId: token.providerAccountId,
        };
      }
      return session;
    },
  },
};
