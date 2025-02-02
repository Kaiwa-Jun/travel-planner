"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Bell, Moon, Globe, Lock, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold">設定</h1>
            <p className="text-muted-foreground mt-2">
              アカウントと利用環境の設定を管理します。
            </p>
          </div>

          <div className="grid gap-6">
            {/* 通知設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  通知設定
                </CardTitle>
                <CardDescription>
                  通知の受信設定を管理します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>メール通知</Label>
                    <p className="text-sm text-muted-foreground">
                      重要なお知らせやアップデート情報をメールで受け取ります。
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>プッシュ通知</Label>
                    <p className="text-sm text-muted-foreground">
                      ブラウザのプッシュ通知を受け取ります。
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* 表示設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  表示設定
                </CardTitle>
                <CardDescription>
                  アプリの表示に関する設定を管理します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ダークモード</Label>
                    <p className="text-sm text-muted-foreground">
                      ダークカラーテーマを使用します。
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* 言語設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  言語設定
                </CardTitle>
                <CardDescription>
                  アプリの表示言語を設定します。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>表示言語</Label>
                    <p className="text-sm text-muted-foreground">
                      現在の言語: 日本語
                    </p>
                  </div>
                  <Button variant="outline">変更</Button>
                </div>
              </CardContent>
            </Card>

            {/* プライバシー設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  プライバシー設定
                </CardTitle>
                <CardDescription>
                  プライバシーに関する設定を管理します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>プロフィールの公開</Label>
                    <p className="text-sm text-muted-foreground">
                      プロフィール情報を他のユーザーに公開します。
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>位置情報の共有</Label>
                    <p className="text-sm text-muted-foreground">
                      現在地情報の共有を許可します。
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* セキュリティ設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  セキュリティ設定
                </CardTitle>
                <CardDescription>
                  アカウントのセキュリティ設定を管理します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>二段階認証</Label>
                    <p className="text-sm text-muted-foreground">
                      ログイン時に追加の認証を要求します。
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ログイン履歴の保存</Label>
                    <p className="text-sm text-muted-foreground">
                      アカウントのログイン履歴を保存します。
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}