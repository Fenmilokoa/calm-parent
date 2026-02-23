"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CYCLE_MS = 4000; // 4s breathe in, 4s breathe out

export function BreathingExercise() {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const cyclePosition = (elapsed % (CYCLE_MS * 2)) / (CYCLE_MS * 2);
      const inPhase = cyclePosition < 0.5;
      setPhase(inPhase ? "in" : "out");
      setProgress(inPhase ? cyclePosition * 2 : (cyclePosition - 0.5) * 2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const scale = phase === "in" ? 0.85 + progress * 0.3 : 1.15 - progress * 0.3;

  return (
    <Card
      className="mx-auto max-w-md"
      role="status"
      aria-live="polite"
      aria-label="Breathing exercise while we prepare your guidance"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">One moment</CardTitle>
            <CardDescription>
              You’re not alone. Let’s get you something you can use right now.
            </CardDescription>
          </div>
          <Badge variant="soft" className="gap-2">
            <LoaderCircle className="size-3.5 animate-spin" />
            Thinking
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center gap-6 py-2">
          <p className="text-center text-sm text-muted-foreground">
            {phase === "in" ? "Breathe in… (4)" : "Breathe out… (4)"}
          </p>
          <div className="relative" aria-hidden>
            <div
              className="rounded-full bg-primary/10 transition-transform duration-300 ease-in-out"
              style={{
                width: 140,
                height: 140,
                transform: `scale(${scale})`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-primary/20" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            You can keep it simple: steady voice, one clear boundary, then wait.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
