"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  FileText,
  GraduationCap,
  BookOpen,
  FolderOpen,
  Gavel,
  ClipboardCheck,
  Star,
  ChartPie,
  GavelIcon,
  File,
  ChartNoAxesColumnIncreasing,
  PencilIcon,
} from "lucide-react";

type RoleConfig = {
  label: string;
  icon: typeof Shield;
  iconColor: string;
  bgColor: string;
  menuItems: { label: string; href: string; icon: typeof Shield }[];
};

const roleConfigs: Record<string, RoleConfig> = {
  admin: {
    label: "Admin",
    icon: Shield,
    iconColor: "text-zinc-900",
    bgColor: "bg-zinc-100",
    menuItems: [
      { label: "Dashboard", href: "/admin", icon: BarChart3 },
      { label: "Posts", href: "/admin/posts", icon: PencilIcon },
    ],
  },
};

export function AdminBar() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !user?.role) {
    return null;
  }

  const config = roleConfigs[user.role];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className={`w-full border-b ${config.bgColor}`}>
      <div className="max-w-7xl mx-auto flex h-10 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
            <Icon className={`h-4 w-4 ${config.iconColor}`} />
            <span>{config.label}</span>
          </div>
          <nav className="flex items-center gap-1">
            {config.menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm text-zinc-700 transition-colors hover:bg-zinc-200 hover:text-zinc-900 font-medium"
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
