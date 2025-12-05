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

    // clear canvas
    ctx.clearRect(0, 0, w, h);
    // console.log(w, h)
    //     // background gradient
    //     const g = ctx.createLinearGradient(0, 0, 0, 20);
    //     g.addColorStop(0, "#051014");
    //     g.addColorStop(1, "#00110f");
    //     ctx.fillStyle = g;
    //     ctx.fillRect(0, 0, w, h);

    // grid lines
    ctx.strokeStyle = "#0f2b25";           // Set the color of the grid lines to a dark teal shade.
    ctx.lineWidth = 1;                     // Set the thickness of the grid lines to 1 pixel.

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
    if (food) drawCell(ctx, food.x, food.y, "#ff8c00", 2);

    // draw snake
    snake.forEach((s, i) => {
      const headColor =
        skin === "nokia" ? "#94f9ff" : skin === "neon" ? "#00ffcc" : "#ffd166";
      const bodyColor =
        skin === "nokia" ? "#7ef87e" : skin === "neon" ? "#00e7ff" : "#f6d365";
      drawCell(ctx, s.x, s.y, i === 0 ? headColor : bodyColor, i === 0 ? 1 : 0);
    });
  }, [snake, food, skin]);

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
    <div className="flex flex-col items-center gap-3 p-3">
      {/* Scoreboard */}
      <div className="flex items-center justify-between w-full max-w-md mb-2">
        <div className="text-sm">
          Score: <span className="score-display">{score}</span>
        </div>
        <div className="text-sm">
          Best: <span className="score-display">{best ?? "-"}</span>
        </div>
      </div>

      {/* Responsive canvas */}
      <div className="w-full max-w-md aspect-square">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg border border-zinc-700"
        />
      </div>

      {/* Controls Container */}
      <div className="flex flex-col mt-4 items-center gap-6 w-full max-w-md mx-auto">
        {/* Top Actions: Play / Resume / Pause */}
        <div className="flex gap-4 w-full justify-center">
          {!running && !gameOver && status === "idle" && (
            <Button className="" onClick={startGame}>
              <Play size={20} />
              <span className="">Start</span>
            </Button>
          )}
          {gameOver && (
            <Button
              className=""
              variant="destructive"
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
            <Button className="" onClick={togglePause}>
              <Pause size={20} />
              <span className="">Pause</span>
            </Button>
          )}
          {!running && !gameOver && status !== "idle" && (
            <Button className="" onClick={togglePause}>
              <Play size={20} />
              <span className="">Resume</span>
            </Button>
          )}
        </div>

        {/* Modern Mobile D-Pad */}
        <GamePad updateDirection={setDirection} />
        {/* Share Notification */}
        {showShare && (
          <div className="mt-3 text-sm text-emerald-400">
            Copied share link to clipboard
          </div>
        )}
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
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Up */}
      <Button
        onClick={() => updateDirection({ x: 0, y: -1 }, "U")}
        className="size-10 rounded-full bg-zinc-900 shadow-md shadow-black/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center text-cyan-400"
      >
        <ArrowUp size={22} />
      </Button>

      {/* Left & Right */}
      <div className="flex gap-6 mt-1">
        <Button
          onClick={() => updateDirection({ x: -1, y: 0 }, "L")}
          className="size-10 rounded-full bg-zinc-900 shadow-md shadow-black/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center text-cyan-400"
        >
          <ArrowLeft size={22} />
        </Button>
        <div className="size-10" /> {/* Placeholder */}
        <Button
          onClick={() => updateDirection({ x: 1, y: 0 }, "R")}
          className="size-10 rounded-full bg-zinc-900 shadow-md shadow-black/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center text-cyan-400"
        >
          <ArrowRight size={22} />
        </Button>
      </div>

      {/* Down */}
      <Button
        onClick={() => updateDirection({ x: 0, y: 1 }, "D")}
        className="size-10 rounded-full bg-zinc-900 shadow-md shadow-black/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center text-cyan-400 mt-1"
      >
        <ArrowDown size={22} />
      </Button>
    </div>
  );
};
