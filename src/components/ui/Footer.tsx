import { Award, Brain, Hand, Home, List, Settings, User, Wallet } from "lucide-react";
import React from "react";
import { Tab } from "~/components/App";

interface FooterProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  showWallet?: boolean;
}

const navItems = [
  { label: 'Home', icon: <Home /> },
  { label: 'Leaderboard', icon: <Award /> },
  { label: 'Tasks', icon: <List /> },
  { label: 'Profile', icon: <User /> },
  { label: 'Wallet', icon: <Wallet /> },
  { label: 'Context', icon: <Brain /> },
  { label: 'Actions', icon: <Hand /> },
];

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab, showWallet = false }) => (
  <div className="sticky bottom-0 left-0 right-0 mx-4 mb-4 bg-neutral-800 border-[3px] border-double border-[#00e7ff] px-2 py-2 rounded-lg z-50">
    <div className="flex justify-around items-center h-14">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => setActiveTab(item.label.toLowerCase() as Tab)}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === item.label.toLowerCase() ? 'text-neon-cyan' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);
