"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export default function PageTracker({
  page,
  meta,
  event = "page_view",
}: {
  page: string;
  meta?: string;
  event?: string;
}) {
  useEffect(() => {
    track(event, page, meta);
  }, [event, page, meta]);

  return null;
}
