"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsage } from "@/lib/usage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressPage() {
  const [usage, setUsage] = useState({ count: 0, date: "" });

  useEffect(() => {
    setUsage(getUsage());
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Button asChild variant="ghost" size="sm">
        <Link href="/">← Back</Link>
      </Button>
      <div className="mt-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Your progress
        </h1>
        <p className="text-muted-foreground">
          Seeing your progress over time can help you notice what’s working.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Guidance used today</CardTitle>
            <CardDescription>Resets at midnight.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {usage.count} <span className="text-muted-foreground">/ 5 free</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">This week</CardTitle>
            <CardDescription>
              Weekly trends and personalised insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-muted-foreground">
              Coming soon
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              We’re building this. Your daily count above is available now.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardHeader>
            <CardTitle>Get unlimited guidance</CardTitle>
            <CardDescription>
              Unlimited interactions, progress tracking, and expert-led content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" disabled>
              Upgrade (coming soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
