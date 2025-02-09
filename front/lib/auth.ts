import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// サーバーサイドとクライアントサイドで異なるAPIエンドポイントを使用
const getApiUrl = () => {
  if (typeof window === "undefined") {
    // サーバーサイド（Next.jsサーバー）での実行
    return "http://back:3001";
  }
  // クライアントサイド（ブラウザ）での実行
  return process.env.NEXT_PUBLIC_API_URL;
};

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  // OAuthプロバイダ設定
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ??
        (() => {
          throw new Error("GOOGLE_CLIENT_ID is not defined");
        })(),
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        (() => {
          throw new Error("GOOGLE_CLIENT_SECRET is not defined");
        })(),
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const apiUrl = getApiUrl();
          const response = await fetch(`${apiUrl}/api/v1/oauth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              google_uid: account.providerAccountId,
              image: user.image,
            }),
          });

          if (!response.ok) {
            return false;
          }

          const data = await response.json();
          // APIから返されたJWTトークンを保存
          user.backendToken = data.token;
          return true;
        } catch (error) {
          console.error("Failed to register with backend:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        // 必要最小限の情報のみを保持
        token.email = profile.email;
        token.name = profile.name;
        token.picture = (profile as { picture?: string }).picture;
        // バックエンドのJWTトークンを保存
        if ("backendToken" in user) {
          token.backendToken = user.backendToken;
        }
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
          backendToken: token.backendToken,
        };
      }
      return session;
    },
  },
};
