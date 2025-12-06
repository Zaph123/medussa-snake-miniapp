"use client"

  import { useEffect, useState } from "react"
  import { Button } from "~/components/ui/Button"

export default function SplashScreen({ onContinue }: { onContinue: () => void }) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><path d=%22M20,80 Q50,20 80,80%22 fill=%22none%22 stroke=%2232FF8F%22 strokeWidth=%221%22 opacity=%220.3%22/></svg>')] bg-repeat" />
      </div>

      {/* Logo with glow */}
      <div className="relative z-10 mb-16 text-center float">
        <div className="inline-block relative">
          <div
            className="text-7xl font-black text-[#7ef87e] glow-text drop-shadow-2xl"
            style={{ textShadow: "0 0 20px rgba(126,248,126,0.6)" }}
          >
            SNAKE
          </div>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#00e7ff] to-transparent rounded-full" />
        </div>
      </div>

      {/* Game info */}
      <div className="relative z-10 mb-12 text-center max-w-xs">
        <p className="text-[#00e7ff] text-sm font-medium opacity-80">NEON ARCADE</p>
        <p className="text-white text-sm mt-2 opacity-60">A modern twist on a classic game</p>
      </div>

      {/* Animated prompt */}
      {showPrompt && (
        <div className="relative z-10">
          <Button onClick={onContinue} className="play-btn pulse-glow text-lg">
            PRESS START
          </Button>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 text-4xl opacity-20 animate-pulse">🎮</div>
      <div className="absolute top-10 right-10 text-4xl opacity-20 animate-pulse" style={{ animationDelay: "0.5s" }}>
        🕹️
      </div>
    </div>
  )
}
