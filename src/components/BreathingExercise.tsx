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

  const scale = phase === "in"
    ? 0.72 + progress * 0.28
    : 1.0 - progress * 0.28;

  const phaseLabel = phase === "in" ? "Breathe in" : "Breathe out";
  const countdown = phase === "in"
    ? Math.ceil(6 - progress * 6)
    : Math.ceil(6 - progress * 6);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f1210]"
      role="status"
      aria-live="polite"
      aria-label="Breathing exercise while we prepare your guidance"
    >
      {/* Orb */}
      <div className="relative flex items-center justify-center" aria-hidden>
        {/* Outer pulse ring */}
        <div
          className="absolute rounded-full bg-primary/10 transition-transform duration-[800ms] ease-in-out"
          style={{
            width: "min(60vw, 60vh)",
            height: "min(60vw, 60vh)",
            transform: `scale(${scale * 1.18})`,
          }}
        />
        {/* Mid ring */}
        <div
          className="absolute rounded-full bg-primary/20 transition-transform duration-[600ms] ease-in-out"
          style={{
            width: "min(60vw, 60vh)",
            height: "min(60vw, 60vh)",
            transform: `scale(${scale * 1.08})`,
          }}
        />
        {/* Core orb */}
        <div
          className="relative rounded-full bg-primary/50 transition-transform duration-[400ms] ease-in-out"
          style={{
            width: "min(60vw, 60vh)",
            height: "min(60vw, 60vh)",
            transform: `scale(${scale})`,
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
