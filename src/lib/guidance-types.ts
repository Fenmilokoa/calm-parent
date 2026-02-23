/**
 * Strict shape for /api/guide response. All arrays are string[]; reassurance is a single string.
 */
export type GuidanceResponse = {
  title: string;
  right_now: string[];
  say_this: string[];
  do_this: string[];
  avoid: string[];
  next_time: string[];
  reassurance: string;
};

const REQUIRED_KEYS: (keyof GuidanceResponse)[] = [
  "title",
  "right_now",
  "say_this",
  "do_this",
  "avoid",
  "next_time",
  "reassurance",
];

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export function validateGuidanceResponse(data: unknown): GuidanceResponse {
  if (data === null || typeof data !== "object") {
    return getFallbackGuidance();
  }
  const o = data as Record<string, unknown>;
  for (const key of REQUIRED_KEYS) {
    if (!(key in o)) return getFallbackGuidance();
  }
  if (typeof o.title !== "string") return getFallbackGuidance();
  if (!isStringArray(o.right_now)) return getFallbackGuidance();
  if (!isStringArray(o.say_this)) return getFallbackGuidance();
  if (!isStringArray(o.do_this)) return getFallbackGuidance();
  if (!isStringArray(o.avoid)) return getFallbackGuidance();
  if (!isStringArray(o.next_time)) return getFallbackGuidance();
  if (typeof o.reassurance !== "string") return getFallbackGuidance();
  return {
    title: o.title,
    right_now: o.right_now,
    say_this: o.say_this,
    do_this: o.do_this,
    avoid: o.avoid,
    next_time: o.next_time,
    reassurance: o.reassurance,
  };
}

export function getFallbackGuidance(): GuidanceResponse {
  return {
    title: "Quick support",
    right_now: ["Take one slow breath.", "Keep your voice calm."],
    say_this: ["I see you're upset. I'm here when you're ready."],
    do_this: ["Stay close but don't crowd.", "Name what you see: 'You're really upset.'"],
    avoid: ["Don't lecture or negotiate mid-tantrum.", "Don't give in to unsafe behavior."],
    next_time: ["When calm, briefly name what happened and one rule."],
    reassurance: "You're doing your best. One step at a time.",
  };
}

/** Flatten guidance to a single string for read-aloud / TTS. */
export function guidanceToReadAloud(g: GuidanceResponse | null): string | null {
  if (!g) return null;
  const parts: string[] = [g.title];
  if (g.right_now.length) parts.push("Right now: " + g.right_now.join(". "));
  if (g.say_this.length) parts.push("Say this: " + g.say_this.join(". "));
  if (g.do_this.length) parts.push("Do this: " + g.do_this.join(". "));
  if (g.avoid.length) parts.push("Avoid: " + g.avoid.join(". "));
  if (g.next_time.length) parts.push("Next time: " + g.next_time.join(". "));
  if (g.reassurance) parts.push(g.reassurance);
  return parts.join(" ");
}
