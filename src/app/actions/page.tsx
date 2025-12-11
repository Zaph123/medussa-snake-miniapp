"use client";

import { ActionsTab } from "~/components/ActionsTab";

export default function ActionsPage() {
  return (
    <div className="container py-6">
      <div className="hud-bar mb-4">
        <h1 className="text-xl font-semibold text-neon-cyan">Actions</h1>
        <p className="text-sm text-gray-300">Share, notify, and interact.</p>
      </div>
      <ActionsTab />
    </div>
  );
}

