import { createClient } from "@/lib/supabase/server";
import {
  Package, ShoppingBag, Plus, ArrowRight,
  Eye, MessageCircle, Users, TrendingUp, Home, MousePointerClick,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [
    { count: catCount },
    { count: itemCount },
    { count: msgCount },
    { data: recentItems },
    { data: { user } },
    { count: totalPageViews },
    { count: todayPageViews },
    { count: homeViews },
    { count: totalContactOpens },
    { data: categoryViewRows },
    { data: itemClickRows },
  ] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("items").select("*", { count: "exact", head: true }),
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("items").select("*, categories(name)").order("created_at", { ascending: false }).limit(5),
    supabase.auth.getUser(),
    supabase.from("analytics").select("*", { count: "exact", head: true }).eq("event", "page_view"),
    supabase.from("analytics").select("*", { count: "exact", head: true }).eq("event", "page_view").gte("created_at", todayISO),
    supabase.from("analytics").select("*", { count: "exact", head: true }).eq("event", "page_view").eq("page", "home"),
    supabase.from("analytics").select("*", { count: "exact", head: true }).eq("event", "contact_open"),
    supabase.from("analytics").select("meta").eq("event", "category_view").not("meta", "is", null),
    supabase.from("analytics").select("meta").eq("event", "item_view").not("meta", "is", null),
  ]);

  const adminName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

  // Build category view counts
  const catViewMap: Record<string, number> = {};
  (categoryViewRows || []).forEach((r: any) => {
    if (r.meta) catViewMap[r.meta] = (catViewMap[r.meta] || 0) + 1;
  });
  const topCategories = Object.entries(catViewMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Build item click counts
  const itemClickMap: Record<string, number> = {};
  (itemClickRows || []).forEach((r: any) => {
    if (r.meta) itemClickMap[r.meta] = (itemClickMap[r.meta] || 0) + 1;
  });
  const topItems = Object.entries(itemClickMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const categoryVisits = (categoryViewRows || []).length;

  return (
    <div className="w-full">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 mb-6 text-white shadow-md">
        <p className="text-rose-100 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold capitalize">{adminName} 👋</h1>
        <p className="text-rose-100 text-sm mt-1">Aradhya Collection Admin Panel</p>
      </div>

      {/* Analytics Cards — 4 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Eye size={18} className="text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
              +{todayPageViews ?? 0} today
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{totalPageViews ?? 0}</div>
          <div className="text-sm text-gray-400 mt-0.5">Total Visitors</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Home size={18} className="text-green-500" />
            </div>
            <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              Homepage
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{homeViews ?? 0}</div>
          <div className="text-sm text-gray-400 mt-0.5">Home Page Visits</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-orange-500" />
            </div>
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
              Categories
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{categoryVisits}</div>
          <div className="text-sm text-gray-400 mt-0.5">Category Opens</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <MessageCircle size={18} className="text-rose-500" />
            </div>
            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
              Contact
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{totalContactOpens ?? 0}</div>
          <div className="text-sm text-gray-400 mt-0.5">Contact Opens</div>
        </div>
      </div>

      {/* Analytics Tables — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp size={15} className="text-orange-400" />
            <h2 className="font-semibold text-gray-700 text-sm">Most Opened Categories</h2>
          </div>
          {topCategories.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No data yet</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {topCategories.map(([name, count], i) => (
                <li key={name} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <MousePointerClick size={15} className="text-purple-400" />
            <h2 className="font-semibold text-gray-700 text-sm">Most Clicked Items</h2>
          </div>
          {topItems.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No data yet</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {topItems.map(([name, count], i) => (
                <li key={name} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-500 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">{name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Store Stats + Messages Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
            <ShoppingBag size={20} className="text-rose-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{catCount ?? 0}</div>
          <div className="text-sm text-gray-400 mt-0.5">Categories</div>
          <Link href="/admin/categories" className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 mt-2">
            Manage <ArrowRight size={11} />
          </Link>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
            <Package size={20} className="text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{itemCount ?? 0}</div>
          <div className="text-sm text-gray-400 mt-0.5">Items</div>
          <Link href="/admin/items" className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1 mt-2">
            Manage <ArrowRight size={11} />
          </Link>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
            <Users size={20} className="text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{msgCount ?? 0}</div>
          <div className="text-sm text-gray-400 mt-0.5">Messages</div>
          <Link href="/admin/user-records" className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 mt-2">
            View <ArrowRight size={11} />
          </Link>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
            <TrendingUp size={20} className="text-teal-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{todayPageViews ?? 0}</div>
          <div className="text-sm text-gray-400 mt-0.5">Today's Visits</div>
          <span className="text-xs text-teal-500 mt-2 flex items-center gap-1">Live count</span>
        </div>
      </div>

      {/* Bottom Row: Quick Actions + Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/categories"
              className="flex items-center gap-3 border border-rose-100 hover:border-rose-300 rounded-xl px-4 py-3 transition-colors group">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                <Plus size={15} className="text-rose-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">Add Category</span>
            </Link>
            <Link href="/admin/items"
              className="flex items-center gap-3 border border-purple-100 hover:border-purple-300 rounded-xl px-4 py-3 transition-colors group">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Plus size={15} className="text-purple-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">Add Item</span>
            </Link>
            <Link href="/admin/user-records"
              className="flex items-center gap-3 border border-indigo-100 hover:border-indigo-300 rounded-xl px-4 py-3 transition-colors group">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Users size={15} className="text-indigo-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">View Messages</span>
            </Link>
          </div>
        </div>

        {/* Recent Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 text-sm">Recently Added Items</h2>
            <Link href="/admin/items" className="text-xs text-rose-500 hover:text-rose-700">View all</Link>
          </div>
          {!recentItems || recentItems.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No items added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentItems.map((item: any) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-rose-50 flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.categories?.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
