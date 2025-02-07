"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Button className="w-full" size="lg" onClick={handleGoogleLogin}>
      Googleでログイン
    </Button>
  );
}
