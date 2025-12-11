"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useMiniApp } from "@neynar/react";
import { Footer } from "~/components/ui/Footer";

/**
 * Client-side gate that delays rendering until the Neynar SDK is ready.
 * Also applies safe-area padding and anchors the persistent footer.
 */
export function AppGate({ children }: { children: ReactNode }) {
  const { isSDKLoaded, context, actions } = useMiniApp();

  useEffect(() => {
    if (isSDKLoaded) {
      actions?.ready?.();
      // Fallback for any host exposing actions on window
      (window as any)?.farcaster?.actions?.ready?.();
    }
  }, [isSDKLoaded, actions]);

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4" />
          <p className="text-[#00e7ff]">Loading Medussa</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
      className="min-h-screen flex flex-col"
    >
      {children}
      <Footer />
    </div>
  );
}
