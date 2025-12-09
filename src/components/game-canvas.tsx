"use client";

import { useEffect, useRef } from "react";
import { Dir, Point, useGame } from "~/stores/gameStore";
import { Button } from "./ui/Button";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  RefreshCcw,
  Pause,
} from "lucide-react";

const CELL = 10;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTickTsRef = useRef<number>(0);

  const {
    snake,
    food,
    score,
    best,
    running,
    gameOver,
    showShare,
    skin,
    startGame,
    setDirection,
    tick,
    resetGame,
    toggleShare,
    togglePause,
    tickMs,
    status,
  } = useGame();

  // responsive grid dimensions
  const gridRef = useRef({ gridW: 0, gridH: 0 });

  // initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resizeCanvas() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // update grid dimensions
      const gridW = Math.floor(canvas.width / CELL);
      const gridH = Math.floor(canvas.height / CELL);
      gridRef.current = { gridW, gridH };

      // reset game for new dimensions
      resetGame(gridW, gridH);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp") setDirection({ x: 0, y: -1 }, "U");
      if (e.key === "ArrowDown") setDirection({ x: 0, y: 1 }, "D");
      if (e.key === "ArrowLeft") setDirection({ x: -1, y: 0 }, "L");
      if (e.key === "ArrowRight") setDirection({ x: 1, y: 0 }, "R");
      if (e.key === " " && !running) startGame();
      if (e.key === "p") togglePause();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, startGame, setDirection, togglePause]);

  // game loop
  useEffect(() => {
    let raf = 0;
    function loop(ts: number) {
      if (!running) return;
      if (!lastTickTsRef.current) lastTickTsRef.current = ts;
      console.log("tick check", ts, lastTickTsRef.current, tickMs);
      // check if enough time has passed for a tick
      //for e.g if tickMs = 120, we want to call tick every 120ms
      const elapsed = ts - lastTickTsRef.current;
      if (elapsed >= tickMs) {
        const { gridW, gridH } = gridRef.current;
        tick(gridW, gridH);
        lastTickTsRef.current = ts;
      }
      // request next frame
      // why: because we want to keep the loop going
      raf = requestAnimationFrame(loop);
    }

    if (running) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, tick, tickMs]);

  // drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const { gridW, gridH } = gridRef.current;

    // clear canvas and fill background
    ctx.fillStyle = "#051014";
    ctx.fillRect(0, 0, w, h);

    // grid lines
    ctx.strokeStyle = "#0f2b25"; // Set the color of the grid lines to a dark teal shade.
    ctx.lineWidth = 1; // Set the thickness of the grid lines to 1 pixel.

    // // Draw vertical grid lines
    // for (let x = 0; x <= gridW; x++) {     // Loop from 0 to the number of grid columns (inclusive).
    //   ctx.beginPath();                     // Start a new path for each line.
    //   ctx.moveTo(x * CELL + 0.5, 0);       // Move to the top of the current column (x position), with +0.5 for sharp 1px lines.
    //   ctx.lineTo(x * CELL + 0.5, h);       // Draw a line down to the bottom of the canvas at the same x position.
    //   ctx.stroke();                        // Render the line on the canvas.
    // }

    // // Draw horizontal grid lines
    // for (let y = 0; y <= gridH; y++) {     // Loop from 0 to the number of grid rows (inclusive).
    //   ctx.beginPath();                     // Start a new path for each line.
    //   ctx.moveTo(0, y * CELL + 0.5);       // Move to the left edge of the current row (y position), with +0.5 for sharp 1px lines.
    //   ctx.lineTo(w, y * CELL + 0.5);       // Draw a line to the right edge of the canvas at the same y position.
    //   ctx.stroke();                        // Render the line on the canvas.
    // }

    // draw food
    if (food) drawCell(ctx, food.x, food.y, "#ff8c00", 2); // neon orange with glow

    // draw snake
    snake.forEach((s, i) => {
      const headColor = "#00e7ff"; // neon cyan
      const bodyColor = "#7ef87e"; // neon green
      drawCell(ctx, s.x, s.y, i === 0 ? headColor : bodyColor, i === 0 ? 1 : 0);
    });
  }, [snake, food]);

  function drawCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    glow: number
  ) {
    const px = x * CELL; // position in pixels
    const py = y * CELL; // position in pixels
    if (glow) {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = color;
      ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
      ctx.restore();
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(px + 0.2, py + 1, CELL - 2, CELL - 2);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 p-5 w-full">
      {/* Scoreboard */}
      <div className="flex items-center justify-between w-full max-w-md mb-2 float">
        <h3 className="text-sm text-[#00e7ff]">
          Score: <span className="score-display">{score}</span>
        </h3>
        <h3 className="text-sm text-[#00e7ff]">
          Best: <span className="score-display">{best ?? "-"}</span>
        </h3>
      </div>
      <div className="flex md:flex-row flex-col items-center justify-center max-w-3xl w-full gap-20">
        {/* Responsive canvas */}
        <div className="w-full max-w-md aspect-square">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Controls Container */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
          {/* Top Actions: Play / Resume / Pause */}
          <div className="flex gap-4 w-full justify-center">
            {!running && !gameOver && status === "idle" && (
              <Button className="play-btn pulse-glow" onClick={startGame}>
                <Play size={20} />
                <span className="">Start</span>
              </Button>
            )}
            {gameOver && (
              <Button
                className="play-btn pulse-glow"
                onClick={() => {
                  startGame();
                  resetGame(gridRef.current.gridW, gridRef.current.gridH);
                }}
              >
                <RefreshCcw size={20} />
                <span className="">Play Again</span>
              </Button>
            )}
            {running && (
              <Button className="pause-btn pulse-glow" onClick={togglePause}>
                <Pause size={20} />
                <span className="">Pause</span>
              </Button>
            )}
            {!running && !gameOver && status !== "idle" && (
              <Button className="play-btn pulse-glow" onClick={togglePause}>
                <Play size={20} />
                <span className="">Resume</span>
              </Button>
            )}
          </div>

          {/* Modern Mobile D-Pad */}
          <GamePad updateDirection={setDirection} />
          {/* Share Notification */}
          {showShare && (
            <div className="mt-3 text-sm text-[#7ef87e]">
              Copied share link to clipboard
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const GamePad = ({
  updateDirection,
}: {
  updateDirection: (direction: Point, key: Dir) => void;
}) => {
  return (
    <div className="dpad flex flex-col items-center gap-3 select-none">
      {/* Up */}
      <button
        onClick={() => updateDirection({ x: 0, y: -1 }, "U")}
        className="flex items-center justify-center"
      >
        <ArrowUp size={22} />
      </button>

      {/* Left & Right */}
      <div className="flex gap-6 mt-1">
        <button
          onClick={() => updateDirection({ x: -1, y: 0 }, "L")}
          className="flex items-center justify-center"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="size-10" /> {/* Placeholder */}
        <button
          onClick={() => updateDirection({ x: 1, y: 0 }, "R")}
          className="flex items-center justify-center"
        >
          <ArrowRight size={22} />
        </button>
      </div>

      {/* Down */}
      <button
        onClick={() => updateDirection({ x: 0, y: 1 }, "D")}
        className="flex items-center justify-center mt-1"
      >
        <ArrowDown size={22} />
      </button>
    </div>
  );
};
