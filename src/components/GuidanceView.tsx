"use client";

import { useCallback, useState } from "react";
import {
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  AlertCircle,
  Clock,
  Heart,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GuidanceResponse } from "@/lib/guidance-types";
import { cn } from "@/lib/utils";

type SectionKey = keyof Omit<GuidanceResponse, "title">;

const SECTION_CONFIG: Record<
  SectionKey,
  { label: string; icon: typeof CheckCircle2; callout?: boolean }
> = {
  right_now: { label: "Right now", icon: CheckCircle2, callout: true },
  say_this: { label: "Say this", icon: MessageSquareText, callout: true },
  do_this: { label: "Do this", icon: CheckCircle2 },
  avoid: { label: "Avoid", icon: AlertCircle },
  next_time: { label: "Next time", icon: Clock },
  reassurance: { label: "A note for you", icon: Heart },
};

function copyText(text: string): Promise<void> {
  if (typeof navigator?.clipboard?.writeText === "function") {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error("Clipboard not available"));
}

function SectionCard({
  sectionKey,
  label,
  icon: Icon,
  callout,
  content,
  bullets,
}: {
  sectionKey: SectionKey;
  label: string;
  icon: typeof CheckCircle2;
  callout?: boolean;
  content: string;
  bullets: string[];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const toCopy = bullets.length
      ? bullets.map((b) => `• ${b}`).join("\n")
      : content;
    copyText(toCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }, [content, bullets]);

  return (
    <Card
      className={cn(
        "relative",
        callout && "border-primary/20 bg-primary/[0.03]"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            <CardTitle className="text-base">{label}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="shrink-0 gap-1.5"
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <Check className="size-4 text-green-600" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {bullets.length > 0 ? (
          <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
            {bullets.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/90">
            {content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function GuidanceView({ guidance }: { guidance: GuidanceResponse }) {
  const { title, right_now, say_this, do_this, avoid, next_time, reassurance } =
    guidance;

  return (
    <div className="space-y-4">
      {title ? (
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      ) : null}
      {(Object.keys(SECTION_CONFIG) as SectionKey[]).map((key) => {
        const config = SECTION_CONFIG[key];
        const value = guidance[key];
        const bullets = Array.isArray(value) ? value : [];
        const content = typeof value === "string" ? value : "";

        const hasContent =
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === "string" && value.trim().length > 0);
        if (!hasContent) return null;

        return (
          <SectionCard
            key={key}
            sectionKey={key}
            label={config.label}
            icon={config.icon}
            callout={config.callout}
            content={content}
            bullets={bullets}
          />
        );
      })}
    </div>
  );
}
