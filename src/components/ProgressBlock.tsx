"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FREE_DAILY_LIMIT = 5;

interface ProgressBlockProps {
  usedToday: number;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function ProgressBlock({
  usedToday,
  isPremium,
  onUpgrade,
}: ProgressBlockProps) {
  if (isPremium) {
    return (
      <Card className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge>Premium</Badge>
          <span className="text-sm text-muted-foreground">
            Unlimited guidance — thank you for supporting Calm Parent.
          </span>
        </div>
      </Card>
    );
  }

  const remaining = Math.max(0, FREE_DAILY_LIMIT - usedToday);

  return (
    <Card className="px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="soft">
            {remaining} / {FREE_DAILY_LIMIT} free today
          </Badge>
          <span className="text-sm text-muted-foreground">
            Guidance resets nightly.
          </span>
        </div>
        {onUpgrade && (
          <Button type="button" onClick={onUpgrade} variant="link" size="sm">
            Upgrade
          </Button>
        )}
      </div>
    </Card>
  );
}
