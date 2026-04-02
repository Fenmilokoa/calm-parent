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
import { getUsageDisplay, setUsageFromServer } from "@/lib/usage";
import type { GuidanceResponse } from "@/lib/guidance-types";
import { guidanceToReadAloud, validateGuidanceResponse } from "@/lib/guidance-types";
import { track } from "@/lib/analytics";
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
  const [loadingSkipped, setLoadingSkipped] = useState(false);
  const [quickPath, setQuickPath] = useState(false);
  const [showDialTooltip, setShowDialTooltip] = useState(false);
  const [showSaveNudge, setShowSaveNudge] = useState(false);
  const isPremium = false; // Could come from auth/subscription

  const refreshUsage = useCallback(() => {
    setUsedToday(getUsageDisplay().count);
  }, []);

  useEffect(() => { refreshUsage(); }, [refreshUsage]);

  useEffect(() => {
    const seen = localStorage.getItem("calm-parent-dial-seen");
    if (!seen) setShowDialTooltip(true);
  }, []);

  const handleNeedGuidance = useCallback(() => {
    refreshUsage();
    if (!isPremium && getUsageDisplay().count >= FREE_DAILY) {
      setStep("limit-reached");
      track("onboarding_drop_off", { reason: "limit_reached" });
      return;
    }
    setStep("describe");
    const seen = localStorage.getItem("calm-parent-dial-seen");
    if (!seen) setShowDialTooltip(true);
    setSituation("");
    setGuidance(null);
    setError(null);
    track("guidance_requested", { source: "describe" });
  }, [isPremium, refreshUsage]);

  const handleQuickGuidance = useCallback(async () => {
    refreshUsage();
    if (!isPremium && getUsageDisplay().count >= FREE_DAILY) {
      setStep("limit-reached");
      track("onboarding_drop_off", { reason: "limit_reached" });
      return;
    }
    setError(null);
    setStep("loading");
    setQuickPath(true);
    setLoadingSkipped(true);
    track("cta_guidance_now");
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: "",
          dial: "balanced",
        }),
      });
      const data = await res.json();
      if (res.status === 429) { setStep("limit-reached"); setQuickPath(false); return; }
      if (!res.ok) throw new Error(data.error || "Request failed");
      const guidancePayload = validateGuidanceResponse(data.guidance);
      setGuidance(guidancePayload);
      setHistory((prev) =>
        prev.concat({
          situation: "General support",
          guidance: guidancePayload,
        })
      );
      if (typeof data.remaining === "number") { setUsageFromServer(data.remaining); setUsedToday(FREE_DAILY - data.remaining); }
      localStorage.setItem("calm-parent-dial-seen", "1");
      setShowDialTooltip(false);
      setStep("result");
      const nudgeDismissed = localStorage.getItem("calm-parent-nudge-dismissed");
      if (!nudgeDismissed) setShowSaveNudge(true);
      setQuickPath(false);
      track("guidance_completed", { source: "quick" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("describe");
      setQuickPath(false);
      setSituation("");
      setDial("balanced");
      track("guidance_error", { message: e instanceof Error ? e.message : "Unknown" });
    }
  }, [isPremium, refreshUsage]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setStep("loading");
    setLoadingSkipped(false);
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
      if (res.status === 429) { setStep("limit-reached"); setQuickPath(false); return; }
      if (!res.ok) throw new Error(data.error || "Request failed");
      const guidancePayload = validateGuidanceResponse(data.guidance);
      setGuidance(guidancePayload);
      setHistory((prev) =>
        prev.concat({
          situation: situation.trim() || "General support",
          guidance: guidancePayload,
        })
      );
      if (typeof data.remaining === "number") { setUsageFromServer(data.remaining); setUsedToday(FREE_DAILY - data.remaining); }
      setStep("result");
      const nudgeDismissed = localStorage.getItem("calm-parent-nudge-dismissed");
      if (!nudgeDismissed) setShowSaveNudge(true);
      track("guidance_completed", { source: "describe" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("describe");
      track("guidance_error", { message: e instanceof Error ? e.message : "Unknown" });
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

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Describe the moment</span>
              <span className="text-muted-foreground/40">→</span>
              <span>Get calm steps</span>
              <span className="text-muted-foreground/40">→</span>
              <span>Feel steadier</span>
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
                  onClick={handleQuickGuidance}
                  aria-label="I need guidance now"
                  data-track="cta_guidance_now"
                >
                  I need guidance now
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNeedGuidance} className="w-full">
                  Add details first for tailored advice
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Not a substitute for professional advice. In crisis, contact emergency services or 988 (US).
                </p>
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
            {step === "describe" && (
              <p className="mt-2 text-xs font-medium text-muted-foreground" aria-live="polite">
                Step 1 of 2
              </p>
            )}
            <div className="mt-4 space-y-4">
              {step === "describe" && (
                <>
                  <div className="relative">
                    <CalmDial value={dial} onChange={setDial} />
                    {showDialTooltip && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground flex items-start justify-between gap-3">
                        <p><span className="font-medium text-foreground">Tip:</span> Slide the dial left for a gentler tone, right for clear direct steps — whatever you can handle right now.</p>
                        <button
                          onClick={() => {
                            setShowDialTooltip(false);
                            localStorage.setItem("calm-parent-dial-seen", "1");
                          }}
                          className="shrink-0 text-muted-foreground/60 hover:text-muted-foreground text-xs mt-0.5"
                          aria-label="Dismiss tip"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
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
                      <CardContent className="p-4 space-y-3 text-sm" role="alert">
                        <p className="text-destructive">{error}</p>
                        <p className="text-muted-foreground">
                          If this keeps happening, check your connection. You can try again in a moment.
                        </p>
                        <Button variant="outline" size="sm" onClick={handleSubmit} className="min-h-[44px]">
                          Try again
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="outline" size="default" onClick={handleStartOver} className="sm:w-auto min-h-[44px] order-2 sm:order-1">
                      Back
                    </Button>
                    <Button onClick={handleSubmit} size="lg" className="flex-1 min-h-[48px] order-1 sm:order-2" data-track="cta_get_guidance">
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
                    <p className="text-xs text-muted-foreground">
                      Not a substitute for professional advice. If you or your child are in danger, contact emergency services or 988 (US).
                    </p>
                    <GuidanceView guidance={guidance} />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {history.length > 1 && (
                      <Button variant="outline" onClick={handleUndo}>
                        Undo last
                      </Button>
                    )}
                    <Button onClick={handleNeedGuidance} data-track="cta_personalised">
                      Get personalised guidance
                    </Button>
                    <Button variant="ghost" onClick={handleStartOver} data-track="cta_home">
                      Home
                    </Button>
                  </div>

                  {showSaveNudge && (
                    <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm flex items-center justify-between gap-3 mt-2">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Save this guidance?</span>{" "}
                        Create a free account to keep a history of what worked.
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <a href="/login" className="text-primary text-xs font-medium hover:underline">
                          Sign up free
                        </a>
                        <button
                          onClick={() => {
                            setShowSaveNudge(false);
                            localStorage.setItem("calm-parent-nudge-dismissed", "1");
                          }}
                          className="text-muted-foreground/60 hover:text-muted-foreground text-xs"
                          aria-label="Dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {step === "loading" && (
          <div className="py-2">
            {!quickPath && (
              <p className="mb-2 text-xs font-medium text-muted-foreground" aria-live="polite">
                Step 2 of 2
              </p>
            )}
            {quickPath || loadingSkipped ? (
              <Card className="mx-auto max-w-md">
                <CardContent className="flex flex-col items-center gap-4 py-8">
                  <p className="text-sm text-muted-foreground">Preparing your guidance…</p>
                  <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
                </CardContent>
              </Card>
            ) : (
              <BreathingExercise onSkip={() => { setLoadingSkipped(true); track("skip_breathing"); }} />
            )}
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
