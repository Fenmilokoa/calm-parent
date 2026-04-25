"use client";

import { useEffect, useState } from "react";

const INHALE_MS = 6000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + EXHALE_MS;
const SKIP_DELAY_MS = 7000;

export function BreathingExercise({ onSkip }: { onSkip?: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const cyclePosition = (elapsed % CYCLE_MS) / CYCLE_MS;
      const inPhase = cyclePosition < 0.5;
      setPhase(inPhase ? "in" : "out");
      setProgress(inPhase ? cyclePosition * 2 : (cyclePosition - 0.5) * 2);
    }, 50);

    const copyTimer = setTimeout(() => setShowCopy(true), 1200);
    const skipTimer = setTimeout(() => setShowSkip(true), SKIP_DELAY_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(copyTimer);
      clearTimeout(skipTimer);
    };
  }, []);

  const expanded = phase === "in";
  const phaseLabel = phase === "in" ? "Breathe in" : "Breathe out";
  const countdown = Math.ceil(6 - progress * 6);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f1210]"
      role="status"
      aria-live="polite"
      aria-label="Breathing exercise while we prepare your guidance"
    >
      {/* Orb — container sized to max outer ring */}
      <div
        className="relative"
        style={{ width: "60vmin", height: "60vmin" }}
        aria-hidden
      >
        {/* Outer ring: 60vmin expanded → 48vmin contracted, 800ms */}
        <div
          className="absolute inset-0 m-auto rounded-full bg-primary/10"
          style={{
            width: expanded ? "60vmin" : "48vmin",
            height: expanded ? "60vmin" : "48vmin",
            transition: "width 800ms ease-in-out, height 800ms ease-in-out",
          }}
        />
        {/* Middle ring: 48vmin expanded → 38vmin contracted, 600ms */}
        <div
          className="absolute inset-0 m-auto rounded-full bg-primary/20"
          style={{
            width: expanded ? "48vmin" : "38vmin",
            height: expanded ? "48vmin" : "38vmin",
            transition: "width 600ms ease-in-out, height 600ms ease-in-out",
          }}
        />
        {/* Inner orb: 38vmin expanded → 30vmin contracted, 400ms */}
        <div
          className="absolute inset-0 m-auto rounded-full bg-primary/50"
          style={{
            width: expanded ? "38vmin" : "30vmin",
            height: expanded ? "38vmin" : "30vmin",
            transition: "width 400ms ease-in-out, height 400ms ease-in-out",
          }}
        />
      </div>

      {/* Phase label */}
      <div className="mt-12 text-center">
        <p className="text-2xl font-light tracking-widest uppercase" style={{ color: "hsl(152 25% 75% / 0.8)" }}>
          {phaseLabel}
        </p>
        <p className="mt-1 text-sm tabular-nums" style={{ color: "hsl(152 25% 50% / 0.6)" }}>
          {countdown}
        </p>
      </div>

      {/* Fading copy — appears after 1.2s */}
      <div
        className="mt-10 px-8 text-center transition-opacity duration-1000 ease-in"
        style={{ opacity: showCopy ? 1 : 0 }}
      >
        <p className="text-lg font-light text-white/70 leading-relaxed">
          You caught yourself.
        </p>
        <p className="text-lg font-light text-white/50 leading-relaxed">
          That matters.
        </p>
      </div>

      {/* Skip — appears after 7s */}
      <div
        className="absolute bottom-10 transition-opacity duration-700 ease-in"
        style={{ opacity: showSkip ? 1 : 0, pointerEvents: showSkip ? "auto" : "none" }}
      >
        <button
          onClick={onSkip}
          className="text-sm text-white/30 hover:text-white/60 transition-colors underline underline-offset-4"
          aria-label="Skip breathing exercise"
          data-track="skip_breathing"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
