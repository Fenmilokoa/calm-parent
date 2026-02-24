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
      title="Choose how the guidance sounds: softer (more empathy), balanced, or more direct"
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
          className="inline-flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border bg-background shadow-sm transition hover:bg-accent disabled:opacity-40"
          aria-label="More empathy (softer tone)"
          title="Softer, more empathetic tone"
        >
          ←
        </button>

        <div className="flex-1">
          <div className="space-y-3">
            <div className="px-1 py-2" title="Drag to choose tone: Softer (left), Balanced (middle), Direct (right)">
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
                aria-label="Guidance tone: Softer, Balanced, or Direct"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground" role="list" aria-label="Slider positions">
              <span id="calm-softer">Softer</span>
              <span id="calm-balanced">Balanced</span>
              <span id="calm-direct">Direct</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={disabled || index === options.length - 1}
          className="inline-flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl border bg-background shadow-sm transition hover:bg-accent disabled:opacity-40"
          aria-label="More direct (clearer steps)"
          title="Clearer, more direct tone"
        >
          →
        </button>
      </div>
    </div>
  );
}
