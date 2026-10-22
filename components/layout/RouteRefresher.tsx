"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Re-fetch server data after every client-side navigation.
 *
 * Pages are force-dynamic, but on a client navigation Next.js only re-renders
 * the segment that changed: the root layout (footer links and copyright) is
 * kept from the first load, and back/forward restores pages from the router
 * cache. Refreshing once the path changes pulls the whole tree again, so
 * admin edits show up without a hard reload.
 */
export function RouteRefresher() {
  const pathname = usePathname();
  const router = useRouter();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    router.refresh();
  }, [pathname, router]);

  return null;
}
