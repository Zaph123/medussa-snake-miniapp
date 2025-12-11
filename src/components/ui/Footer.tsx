"use client"

import { Award, Brain, Hand, Home, List, User, Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { USE_WALLET } from "~/lib/constants";


const navItems = [
  { label: "Home", icon: <Home />, href: "/" },
  { label: "Leaderboard", icon: <Award />, href: "/leaderboard" },
  { label: "Tasks", icon: <List />, href: "/tasks" },
  { label: "Profile", icon: <User />, href: "/me" },
  // { label: "Wallet", icon: <Wallet />, href: "/wallet", gated: true },
  // { label: "Context", icon: <Brain />, href: "/context" },
  // { label: "Actions", icon: <Hand />, href: "/actions" },
];

export const Footer: React.FC = () => {
  const pathname = usePathname();
  // const items = navItems.filter((item) => (item.gated ? USE_WALLET : true));
  const items = navItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-4 mb-4 px-2 py-2 rounded-lg z-50 backdrop-blur">
      <div className="flex justify-around items-center h-14">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label} className="flex-1">
              <div
                className={`flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
                  isActive ? "text-neon-cyan" : "text-gray-400"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
