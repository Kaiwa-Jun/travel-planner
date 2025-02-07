"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Search,
  PlusCircle,
  Image,
  User,
  Settings,
  FileText,
  UserCircle2,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/search", label: "検索", icon: Search },
    { href: "/create", label: "プラン作成", icon: PlusCircle },
    { href: "/albums", label: "アルバム", icon: Image },
  ];

  const menuItems = [
    { href: "/profile", label: "マイページ", icon: User },
    { href: "/terms", label: "利用規約", icon: FileText },
    { href: "/privacy", label: "プライバシーポリシー", icon: FileText },
    { href: "/settings", label: "設定", icon: Settings },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const renderAuthButtons = () => {
    if (session) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <UserCircle2 className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {session.user?.name && (
              <>
                <div className="px-2 py-1.5 text-sm font-medium">
                  {session.user.name}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            {menuItems.map(({ href, label, icon: Icon }) => (
              <DropdownMenuItem key={href} asChild>
                <Link href={href} className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>ログアウト</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button asChild variant="default">
        <Link href="/login">ログイン</Link>
      </Button>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b md:hidden">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span className="font-bold">Travel Planner</span>
          </Link>
          <div className="flex items-center gap-2">{renderAuthButtons()}</div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t md:top-0 md:bottom-auto">
        <div className="container flex h-16 items-center">
          <div className="hidden md:flex md:mr-8 md:items-center md:space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6" />
              <span className="font-bold">Travel Planner</span>
            </Link>
          </div>

          <div className="hidden md:flex md:space-x-4">
            {links.map(({ href, label, icon: Icon }) => (
              <Button
                key={href}
                variant={pathname === href ? "default" : "ghost"}
                asChild
              >
                <Link href={href} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex md:hidden flex-1 justify-around">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center space-y-1 ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span className="text-xs">ホーム</span>
              </motion.div>
            </Link>
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center space-y-1 ${
                    pathname === href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="ml-auto hidden md:flex items-center gap-2">
            {renderAuthButtons()}
          </div>
        </div>
      </nav>
    </>
  );
}
