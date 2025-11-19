import { useEffect } from "react";

/**
 * Auto-load Midtrans Snap.js correctly with client key
 */
export function useMidtransSnap(isProduction = false) {
  useEffect(() => {
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      console.error("VITE_MIDTRANS_CLIENT_KEY belum diatur di .env");
      return;
    }

    const scriptId = "midtrans-snap-script";

    // Remove previous script to avoid stale snap instance
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => console.log("✅ Midtrans Snap.js loaded successfully");
    script.onerror = () => console.error("❌ Failed to load Midtrans Snap.js");

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isProduction]);
}
