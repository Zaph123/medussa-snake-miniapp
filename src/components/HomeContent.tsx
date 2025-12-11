"use client";

import { useState } from "react";
import GameCanvas from "./game-canvas";
import SplashScreen from "./SplashScreen";
import { useGame } from "~/stores/gameStore";


export function HomeContent() {
  const [showSplash, setShowSplash] = useState(true);
  const {startGame} = useGame();

  const handleNext = () => {
    setShowSplash(false);
    startGame();
  }
  
  if (showSplash) {
    return <SplashScreen onContinue={handleNext} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mb-28">
      <GameCanvas />
    </div>
  );
}

