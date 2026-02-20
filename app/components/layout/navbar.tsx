"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Home,
  ClipboardList,
  Menu,
  X,
  CameraIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/hooks/useAuth";

const allMenuItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Posts", href: "/posts", icon: CameraIcon },
  { label: "Gallery", href: "/gallery", icon: ClipboardList },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.refresh();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <h1 className="text-lg font-black tracking-tighter leading-none">
            <span className="text-zinc-900">Luis Foto</span>{" "}
            <span className="text-zinc-400">Nature</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {allMenuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors relative group",
                  active
                    ? "text-zinc-900"
                    : "text-zinc-700 hover:text-zinc-900",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <span
                  className={cn(
                    "absolute top-5.5 left-0 h-0.5 bg-zinc-900 transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Auth Section */}
          {isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 px-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium text-zinc-900 max-w-28 truncate">
                      {user?.name || user?.email?.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-zinc-600 capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-zinc-900">
                        {user?.name || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-zinc-600">{user?.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-3 px-2 py-2.5 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Logout</span>
                    <span className="text-xs text-red-500">Sign out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-all"
            >
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4">
          <nav className="flex flex-col gap-1">
            {allMenuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-700 hover:bg-gray-50 hover:text-zinc-900",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
