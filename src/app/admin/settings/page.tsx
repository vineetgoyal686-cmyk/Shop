"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Settings, Phone, Save, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const supabase = createClient();
  const [contactPhone, setContactPhone] = useState("");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "contact_phone")
        .single();
      setContactPhone(data?.value || "");
      setFetching(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!contactPhone.trim()) return;
    setSaving(true);

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "contact_phone", value: contactPhone.trim(), updated_at: new Date().toISOString() });

    if (error) {
      toast.error("Could not save. Please try again.");
    } else {
      setSaved(true);
      toast.success("Settings saved!");
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings size={22} className="text-rose-500" /> Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">Manage your store settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Phone size={15} className="text-rose-400" /> Contact Information
        </h2>

        {fetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-rose-400" size={22} />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Phone size={15} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 8077982246"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                This number is shown on the homepage and footer for customers to call.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saved ? (
                <CheckCircle2 size={15} />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
