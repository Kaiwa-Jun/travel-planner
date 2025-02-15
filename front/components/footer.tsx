"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const footerLinks = {
  サービス: [
    { label: "スポット検索", href: "/search" },
    { label: "プラン作成", href: "/create" },
    { label: "アルバム", href: "/albums" },
  ],
  サポート: [
    { label: "よくある質問", href: "/faq" },
    { label: "お問い合わせ", href: "/contact" },
    { label: "ヘルプセンター", href: "/help" },
  ],
  会社情報: [
    { label: "会社概要", href: "/about" },
    { label: "利用規約", href: "/terms" },
    { label: "プライバシーポリシー", href: "/privacy" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export function Footer() {
  const pathname = usePathname();

  // フッター表示可否を管理するフラグ
  const [isWide, setIsWide] = useState(false);

  // マウント後のみ画面幅をチェックし、状態を更新
  useEffect(() => {
    setIsWide(window.innerWidth >= 768);
  }, []);

  // サーバーサイドでは一旦フッターを描画し、クライアントで幅を判定
  // pathname === "/" でなければ、最初から非表示にしておく場合は:
  // const initialShowFooter = pathname === "/";
  // などで調整してもOKです。

  const showFooter = pathname === "/" || isWide;

  if (!showFooter) return null;

  return (
    <footer className="bg-muted mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド情報 */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6" />
              <span className="font-bold text-lg">Travel Planner</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              効率的な旅程作成から思い出の保存まで、
              <br className="hidden sm:block" />
              旅のすべてをサポートします。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* リンクセクション */}
          <div className="col-span-3 grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-3">
                <h3 className="font-semibold">{title}</h3>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t mt-8 pt-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Travel Planner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
