"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { motion } from "framer-motion";
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted">
      <Navigation />

      <main className="container flex items-center justify-center min-h-screen py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>ログイン</CardTitle>
              <CardDescription>
                アカウントにログインして、旅行プランを作成しましょう
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleLoginButton />
              <div className="text-center text-sm text-muted-foreground">
                ログインすることで、利用規約とプライバシーポリシーに同意したことになります。
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
