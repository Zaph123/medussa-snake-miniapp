"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/Button";

export default function SplashScreen({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#050816] via-[#0b102d] to-[#050816] relative overflow-hidden">

      {/* Logo */}
      <div className="relative z-10 mb-16 text-center animate-fade-in">
        <div className="inline-block relative">
          <h1
            className="sm:text-7xl text-4xl font-black text-[#7ef87e] tracking-wider drop-shadow-2xl animate-[flicker_3s_infinite]"
           
          >
            MEDUSSA
          </h1>
          <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#00e7ff] to-transparent rounded-full opacity-70" />
        </div>
      </div>

      {/* Game Info */}
      <div className="relative z-10 mb-12 text-center max-w-xs space-y-3 animate-fade-in-delayed">
        <p className="text-[#00e7ff] text-xs tracking-widest uppercase opacity-80">
          Neon Survival Mode
        </p>

        <div className="bg-white/5 backdrop-blur-md border border-[#00e7ff]/10 rounded-xl p-4 shadow-[0_0_30px_rgba(0,231,255,0.05)]">
          <h2 className="text-[#7ef87e] text-sm font-semibold mb-2 uppercase tracking-wider">
            Rules
          </h2>
          <ul className="text-white/60 text-xs space-y-1">
            <li>• Don’t collide with yourself</li>
            <li>• Avoid the neon bombs</li>
          </ul>
        </div>
      </div>

      {/* Start Button */}
      {showPrompt && (
        <div className="relative z-10 animate-fade-up">
          <Button
            onClick={onContinue}
            className="
            play-btn
              rounded-full
            "
          >
            START GAME
          </Button>

        </div>
      )}

      {/* Floating decor */}
      <div className="absolute bottom-10 left-10 opacity-10 animate-float">
        ◉
      </div>
      <div className="absolute top-10 right-10 opacity-10 animate-float delay-500">
        ◎
      </div>
    </div>
  );
}
