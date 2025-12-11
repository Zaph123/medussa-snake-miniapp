"use client";

import { useCallback, useRef, useState } from "react";
import type React from "react";
import { Dir, Point } from "~/stores/gameStore";

const DEADZONE = 12;

interface VirtualJoystickProps {
  updateDirection: (direction: Point, key: Dir) => void;
}

export default function VirtualJoystick({
  updateDirection,
}: VirtualJoystickProps) {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const lastDirRef = useRef<Dir | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const emitDirection = useCallback(
    (dir: Point, code: Dir) => {
      if (lastDirRef.current !== code) {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(10);
        }
        lastDirRef.current = code;
      }
      updateDirection(dir, code);
    },
    [updateDirection]
  );

  const handleStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = zoneRef.current?.getBoundingClientRect();
    if (!rect) return;
    activeRef.current = true;
    setIsDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    zoneRef.current?.setPointerCapture(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (Math.abs(dx) < DEADZONE && Math.abs(dy) < DEADZONE) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      emitDirection({ x: dx > 0 ? 1 : -1, y: 0 }, dx > 0 ? "R" : "L");
    } else {
      emitDirection({ x: 0, y: dy > 0 ? 1 : -1 }, dy > 0 ? "D" : "U");
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeRef.current) return;
    activeRef.current = false;
    setIsDragging(false);
    lastDirRef.current = null;
    zoneRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full">
      <div
        ref={zoneRef}
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`relative mx-auto mt-2 md:size-56 size-32 rounded-2xl touch-none select-none joystick-zone ${
          isDragging ? "dragging" : ""
        }`}
        style={{ touchAction: "none" }}
      >
        <div className="absolute inset-1 rounded-2xl border border-[#123337]" />
        <div className="absolute inset-1 flex items-center justify-center">
          <div
            className={`size-16 rounded-full border-2 joystick-thumb ${
              isDragging ? "border-[#00e7ff]" : "border-[#123337]"
            }`}
          />
        </div>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          <span className="border-r border-b border-[#0f2b25]" />
          <span className="border-r border-b border-[#0f2b25]" />
          <span className="border-b border-[#0f2b25]" />
          <span className="border-r border-b border-[#0f2b25]" />
          <span className="border-r border-b border-[#0f2b25]" />
          <span className="border-b border-[#0f2b25]" />
          <span className="border-r border-[#0f2b25]" />
          <span className="border-r border-[#0f2b25]" />
          <span />
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] text-[#4dc4c7] opacity-70">
          Drag to move
        </div>
      </div>
    </div>
  );
}

