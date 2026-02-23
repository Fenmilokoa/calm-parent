"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalmDial, type DialValue } from "@/components/CalmDial";
import { BreathingExercise } from "@/components/BreathingExercise";
import { PrivacyBanner } from "@/components/PrivacyBanner";
import { VoiceControls } from "@/components/VoiceControls";
import { ProgressBlock } from "@/components/ProgressBlock";
import { GuidanceView } from "@/components/GuidanceView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getUsage, incrementUsage } from "@/lib/usage";
import type { GuidanceResponse } from "@/lib/guidance-types";
import { guidanceToReadAloud, validateGuidanceResponse } from "@/lib/guidance-types";
import { ShieldCheck } from "lucide-react";

type Step =
  | "landing"
  | "describe"
  | "loading"
  | "result"
  | "limit-reached";

const FREE_DAILY = 5;

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [situation, setSituation] = useState("");
  const [dial, setDial] = useState<DialValue>("balanced");
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ situation: string; guidance: GuidanceResponse }[]>([]);
  const [usedToday, setUsedToday] = useState(0);
  const isPremium = false; // Could come from auth/subscription

  const refreshUsage = useCallback(() => {
    setUsedToday(getUsage().count);
  }, []);

  useEffect(() => {
    refreshUsage();
    // #region agent log
    fetch("http://127.0.0.1:7574/ingest/05274255-d603-4876-b34f-a620ea482593", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "83788e" },
      body: JSON.stringify({
        sessionId: "83788e",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "src/app/page.tsx:useEffect",
        message: "Home mounted",
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [refreshUsage]);

  const handleNeedGuidance = useCallback(() => {
    refreshUsage();
    if (!isPremium && getUsage().count >= FREE_DAILY) {
      setStep("limit-reached");
      return;
    }
    setStep("describe");
    setSituation("");
    setGuidance(null);
    setError(null);
  }, [isPremium, refreshUsage]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setStep("loading");
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: situation.trim() || "My child is having a difficult moment and I need support.",
          dial,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      const guidancePayload = validateGuidanceResponse(data.guidance);
      setGuidance(guidancePayload);
      setHistory((prev) =>
        prev.concat({
          situation: situation.trim() || "General support",
          guidance: guidancePayload,
        })
      );
      incrementUsage();
      setUsedToday(getUsage().count);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("describe");
    }
  }, [situation, dial]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    if (history.length === 1) {
      setHistory([]);
      setGuidance(null);
      setSituation(history[0]?.situation ?? "");
      setStep("describe");
      return;
    }
    setHistory((prev) => prev.slice(0, -1));
    const previous = history[history.length - 2];
    setGuidance(previous?.guidance ?? null);
    setSituation(previous?.situation ?? "");
    setStep("result");
  }, [history]);

  const handleStartOver = useCallback(() => {
    setStep("landing");
    setSituation("");
    setGuidance(null);
    setHistory([]);
    setError(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/25">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-10 pt-8 sm:pt-12">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Calm Parent</p>
              <p className="text-xs text-muted-foreground">
                Real-time guidance for hard moments
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/progress">Progress</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/privacy">Privacy</Link>
            </Button>
          </nav>
        </header>

        <div className="mb-8 flex justify-center">
          <Badge variant="soft" className="gap-2 px-4 py-1.5">
            <span className="inline-block size-2 rounded-full bg-emerald-500/70" />
            No sign-in needed to start. Your data stays private.
          </Badge>
        </div>

        {step === "landing" && (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Calm, clear support—right when you need it
              </h1>
              <p className="mx-auto max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                During tantrums, conflict, refusal, or big feelings: get gentle,
                evidence-informed steps you can use in the moment.
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Start in one tap</CardTitle>
                <CardDescription>
                  We’ll keep it simple. One clear next step, then the next.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleNeedGuidance}
                  aria-label="I need guidance now"
                >
                  I need guidance now
                </Button>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                  <span>Hands full?</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Use voice input and read-aloud.</span>
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t bg-muted/30 py-4">
                <Button asChild variant="link">
                  <Link href="/progress">View your progress</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {(step === "describe" || step === "result") && (
          <>
            <ProgressBlock
              usedToday={usedToday}
              isPremium={isPremium}
              onUpgrade={() => {}}
            />
            <div className="mt-4 space-y-4">
              {step === "describe" && (
                <>
                  <CalmDial value={dial} onChange={setDial} />
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">
                        What’s happening right now?
                      </CardTitle>
                      <CardDescription>
                        Optional. One sentence is enough.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        id="situation"
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        placeholder="e.g. My 4-year-old is refusing to leave the park and is screaming."
                        rows={3}
                        maxLength={500}
                      />
                      <VoiceControls onTranscript={setSituation} textToRead={null} />
                    </CardContent>
                  </Card>
                  {error && (
                    <Card className="border-destructive/30 bg-destructive/5">
                      <CardContent className="p-4 text-sm text-destructive" role="alert">
                        {error}
                      </CardContent>
                    </Card>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" onClick={handleStartOver} className="sm:w-auto">
                      Back
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1">
                      Get guidance
                    </Button>
                  </div>
                </>
              )}

              {step === "result" && guidance && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Your next steps
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Keep your voice low. One boundary. Then wait.
                        </p>
                      </div>
                      <VoiceControls onTranscript={() => {}} textToRead={guidanceToReadAloud(guidance)} />
                    </div>
                    <GuidanceView guidance={guidance} />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {history.length > 1 && (
                      <Button variant="outline" onClick={handleUndo}>
                        Undo last
                      </Button>
                    )}
                    <Button onClick={handleNeedGuidance}>New guidance</Button>
                    <Button variant="ghost" onClick={handleStartOver}>
                      Home
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {step === "loading" && (
          <div className="py-2">
            <BreathingExercise />
          </div>
        )}

        {step === "limit-reached" && (
          <Card className="mx-auto max-w-xl text-center">
            <CardHeader>
              <CardTitle>You’ve used your free guidance for today</CardTitle>
              <CardDescription>
                Upgrade for unlimited guidance, progress tracking, and expert content.
              </CardDescription>
            </CardHeader>
            <CardContent />
            <CardFooter className="justify-center">
              <Button onClick={() => setStep("landing")}>Back to home</Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <PrivacyBanner />
    </div>
  );
}
