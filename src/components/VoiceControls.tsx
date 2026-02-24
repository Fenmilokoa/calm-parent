"use client";

import { useCallback, useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  textToRead: string | null;
  disabled?: boolean;
}

export function VoiceControls({
  onTranscript,
  textToRead,
  disabled,
}: VoiceControlsProps) {
  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    if (disabled || typeof window === "undefined") return;
    setError(null);
    const SpeechRecognitionCtor = (window as any).webkitSpeechRecognition ?? (window as any).SpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setError("Voice input isn’t supported in this browser. Try Chrome or Edge.");
      return;
    }
    const rec = new SpeechRecognitionCtor() as any;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      const text = e?.results?.[0]?.[0]?.transcript ?? "";
      onTranscript(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  }, [onTranscript, disabled]);

  const readAloud = useCallback(() => {
    if (!textToRead || disabled || typeof window === "undefined") return;
    setError(null);
    const utterance = new SpeechSynthesisUtterance(
      textToRead.replace(/\*\*[^*]+\*\*/g, "").slice(0, 400)
    );
    utterance.rate = 0.9;
    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);
    window.speechSynthesis.speak(utterance);
    setReading(true);
  }, [textToRead, disabled]);

  const stopReading = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    setReading(false);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        onClick={startListening}
        disabled={disabled}
        variant="outline"
        size="sm"
        aria-label="Describe situation with voice"
        title="Describe the situation with your voice (hands-free)"
        className="min-h-[44px]"
      >
        <Mic className="size-4" aria-hidden />
        {listening ? "Listening…" : "Voice input"}
      </Button>
      {textToRead && (
        <Button
          type="button"
          onClick={reading ? stopReading : readAloud}
          disabled={disabled}
          variant="outline"
          size="sm"
          aria-label={reading ? "Stop reading" : "Read guidance aloud"}
          title={reading ? "Stop reading aloud" : "Listen to the guidance (hands-free)"}
          className="min-h-[44px]"
        >
          {reading ? <Square className="size-4" /> : <Volume2 className="size-4" />}
          {reading ? "Stop" : "Read aloud"}
        </Button>
      )}
      {error && (
        <p className="w-full text-xs text-amber-700 dark:text-amber-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
