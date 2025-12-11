"use client";

import WalletPage from "~/components/WalletTab";

export default function WalletRoute() {
  return (
    <div className="container py-6">
      <div className="hud-bar mb-4">
        <h1 className="text-xl font-semibold text-neon-cyan">Wallet</h1>
        <p className="text-sm text-gray-300">Manage your wallets and actions.</p>
      </div>
      <WalletPage />
    </div>
  );
}

