"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles, LayoutGrid, Package, ShoppingBag, LogOut,
  UserCircle, PanelLeftClose, PanelLeftOpen, Users, Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/categories", label: "Categories", icon: ShoppingBag },
  { href: "/admin/items", label: "Items", icon: Package },
  { href: "/admin/user-records", label: "User Records", icon: Users },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAdminEmail(user.email || "");
        setAdminName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out successfully!");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out flex-shrink-0 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Header: Logo + Toggle */}
      <div className={`flex items-center border-b border-gray-100 h-14 px-3 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 flex-shrink-0 bg-gradient-to-br from-rose-400 to-pink-600 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-gray-800 text-sm leading-tight truncate">Admin Panel</p>
              <p className="text-xs text-gray-400 truncate">Aradhya Collection</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors flex-shrink-0"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed
            ? <PanelLeftOpen size={17} />
            : <PanelLeftClose size={17} />
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 mt-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-rose-50 text-rose-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Profile + Logout */}
      <div className="border-t border-gray-100 p-2 space-y-0.5 flex-shrink-0">
        <Link
          href="/admin/profile"
          title={collapsed ? adminName : undefined}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-rose-100 ring-2 ring-rose-200">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-rose-500 font-bold text-sm uppercase">
                {adminName.charAt(0)}
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate capitalize">{adminName}</p>
              <p className="text-xs text-gray-400 truncate">{adminEmail}</p>
            </div>
          )}
        </Link>

        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
