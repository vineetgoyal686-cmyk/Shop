"use client";

import { usePathname } from "next/navigation";
import { LayoutGrid, ShoppingBag, Package, Users, UserCircle, Settings } from "lucide-react";

const routeMeta: Record<string, { title: string; icon: React.ElementType }> = {
  "/admin":               { title: "Dashboard",    icon: LayoutGrid },
  "/admin/categories":    { title: "Categories",   icon: ShoppingBag },
  "/admin/items":         { title: "Items",        icon: Package },
  "/admin/user-records":  { title: "User Records", icon: Users },
  "/admin/profile":       { title: "Profile",      icon: UserCircle },
  "/admin/settings":      { title: "Settings",     icon: Settings },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const meta = routeMeta[pathname] || { title: "Admin", icon: LayoutGrid };
  const Icon = meta.icon;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <Icon size={18} className="text-rose-500" />
        <h1 className="text-base font-bold text-gray-800">{meta.title}</h1>
      </div>
      <span className="text-xs text-gray-400 font-medium">{dateStr}</span>
    </header>
  );
}
