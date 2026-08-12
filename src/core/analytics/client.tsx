"use client";

import { useEffect, useRef } from "react";

// Analytics Payload Interface
export interface AnalyticsPayload {
  websiteId: string;
  visitorId: string;
  sessionId: string;
  eventName: string;
  path: string;
  referrer: string;
  metadata?: Record<string, any>;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

declare global {
  interface Window {
    trackEvent: (eventName: string, metadata?: Record<string, any>) => void;
  }
}

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getOrGenerateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let visitorId = localStorage.getItem("bos_visitor_id");
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem("bos_visitor_id", visitorId);
  }
  return visitorId;
}

function getOrGenerateSessionId(): string {
  if (typeof window === "undefined") return "";
  const now = Date.now();
  let sessionId = localStorage.getItem("bos_session_id");
  const lastActivity = localStorage.getItem("bos_last_activity");

  // 30 minute timeout
  if (!sessionId || !lastActivity || now - parseInt(lastActivity, 10) > 30 * 60 * 1000) {
    sessionId = generateId();
    localStorage.setItem("bos_session_id", sessionId);
  }

  localStorage.setItem("bos_last_activity", now.toString());
  return sessionId;
}

function getUTMParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };
}

export function AnalyticsTracker({ websiteId }: { websiteId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const visitorId = getOrGenerateVisitorId();
    const sessionId = getOrGenerateSessionId();
    const utm = getUTMParams();

    const sendPayload = (eventName: string, metadata?: Record<string, any>) => {
      const payload: AnalyticsPayload = {
        websiteId,
        visitorId,
        sessionId,
        eventName,
        path: window.location.pathname,
        referrer: document.referrer,
        metadata,
        ...utm
      };

      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics/collect", JSON.stringify(payload));
        } else {
          fetch("/api/analytics/collect", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
            keepalive: true
          });
        }
      } catch (error) {
        // Silently fail to avoid breaking the website
      }
      
      // Update last activity on every event
      localStorage.setItem("bos_last_activity", Date.now().toString());
    };

    // Expose trackEvent to window for custom buttons
    window.trackEvent = sendPayload;

    // Only track page view once per mount
    if (!tracked.current) {
      sendPayload("page_view");
      tracked.current = true;

      // 1. Setup Scroll Depth Tracking
      const scrollThresholds = new Set([25, 50, 75, 90, 100]);
      const trackedThresholds = new Set<number>();
      
      const handleScroll = () => {
        // Throttle scroll events (basic)
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 100;

        for (const threshold of Array.from(scrollThresholds)) {
          if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
            trackedThresholds.add(threshold);
            sendPayload("scroll_depth", { depth: threshold });
          }
        }
      };
      
      let scrollTimeout: NodeJS.Timeout;
      const throttledScroll = () => {
        if (!scrollTimeout) {
          scrollTimeout = setTimeout(() => {
            handleScroll();
            scrollTimeout = null as any;
          }, 500); // 500ms throttle
        }
      };
      window.addEventListener("scroll", throttledScroll, { passive: true });

      // 2. Setup Click Map Tracking
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const interactive = target.closest("a, button, [role='button']");
        
        if (interactive) {
          const tagName = interactive.tagName.toLowerCase();
          const href = (interactive as HTMLAnchorElement).href || "";
          const text = interactive.textContent?.trim().substring(0, 50) || "";
          
          sendPayload("click", {
            tagName,
            href,
            text,
            x: e.clientX,
            y: e.clientY,
            vw: window.innerWidth,
            vh: window.innerHeight
          });
        }
      };
      document.addEventListener("click", handleClick, { capture: true, passive: true });

      // Cleanup
      return () => {
        window.removeEventListener("scroll", throttledScroll);
        document.removeEventListener("click", handleClick, { capture: true });
      };
    }

    // Optionally attach to history API if it's an SPA (Next.js App Router usually remounts layout/page differently but this is safe)
    
  }, [websiteId]);

  return null; // This is a headless component
}
