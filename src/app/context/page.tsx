"use client";

import { ContextTab } from "~/components/ContextTab";

export default function ContextPage() {
  return (
    <div className="container py-6">
      <div className="hud-bar mb-4">
        <h1 className="text-xl font-semibold text-neon-cyan">Context</h1>
        <p className="text-sm text-gray-300">Current Farcaster context snapshot.</p>
      </div>
      <ContextTab />
    </div>
  );
}

