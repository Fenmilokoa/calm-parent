"use client";

import { useCallback, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export type DialValue = "more-empathy" | "balanced" | "more-direct";

interface CalmDialProps {
  value: DialValue;
  onChange: (v: DialValue) => void;
  disabled?: boolean;
}

const labels: Record<DialValue, string> = {
  "more-empathy": "Softer, more empathy",
  balanced: "Balanced",
  "more-direct": "Clear & direct",
};

export function CalmDial({ value, onChange, disabled }: CalmDialProps) {
  const options: DialValue[] = useMemo(
    () => ["more-empathy", "balanced", "more-direct"],
    []
  );
  const index = options.indexOf(value);

  const handlePrev = useCallback(() => {
    if (disabled) return;
    const i = Math.max(0, index - 1);
    onChange(options[i]);
  }, [index, onChange, disabled]);

  const handleNext = useCallback(() => {
    if (disabled) return;
    const i = Math.min(options.length - 1, index + 1);
    onChange(options[i]);
  }, [index, onChange, disabled]);

  const sliderValue = index * 50; // 0, 50, 100

  return (
    <div
      className="rounded-2xl border bg-card p-6 shadow-sm"
      role="group"
      aria-label="Tone of guidance: choose between more empathy or more direct"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Calm dial
          </p>
          <p className="text-sm text-muted-foreground">
            Slide for a softer tone or clearer direction—whatever you can handle right now.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" />
          {labels[value]}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={disabled || index === 0}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background shadow-sm transition hover:bg-accent disabled:opacity-40"
          aria-label="More empathy"
        >
          ←
        </button>

        <div className="flex-1">
          <div className="space-y-3">
            <div className="px-1">
              <Slider
                value={[sliderValue]}
                min={0}
                max={100}
                step={50}
                disabled={disabled}
                onValueChange={(v: number[]) => {
                  const nextIndex = Math.round((v[0] ?? 50) / 50);
                  onChange(options[Math.max(0, Math.min(2, nextIndex))]);
                }}
                aria-label="Calm dial"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Softer</span>
              <span>Balanced</span>
              <span>Direct</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={disabled || index === options.length - 1}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background shadow-sm transition hover:bg-accent disabled:opacity-40"
          aria-label="More direct"
        >
          →
        </button>
      </div>
    </div>
  );
}
