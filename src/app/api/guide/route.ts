import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateGuidanceResult, getFallbackGuidanceResult } from "@/lib/guidance-types";
import { Redis } from "@upstash/redis";
import { findBestScenario } from "@/lib/scenarioMatcher";

const FREE_DAILY_LIMIT = 5;

let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
  }
} catch {
  console.warn("Upstash Redis not configured — rate limiting disabled");
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; count: number; remaining: number }> {
  if (!redis) return { allowed: true, count: 0, remaining: FREE_DAILY_LIMIT };
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `calm-parent:usage:${ip}:${today}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 86400);
    return { allowed: count <= FREE_DAILY_LIMIT, count, remaining: Math.max(0, FREE_DAILY_LIMIT - count) };
  } catch {
    console.warn("Redis rate-limit check failed — allowing request");
    return { allowed: true, count: 0, remaining: FREE_DAILY_LIMIT };
  }
}

export type DialValue = "more-empathy" | "balanced" | "more-direct";

const TONE_PROMPTS: Record<DialValue, string> = {
  "more-empathy":
    "Tone: very gentle and empathetic. Validate feelings first; use soft phrasing.",
  balanced:
    "Tone: calm and balanced. Acknowledge feelings but give clear, supportive structure.",
  "more-direct":
    "Tone: clear and direct. Concise, action-oriented. Minimal validation, focus on steps.",
};

const MODEL_CANDIDATES = [
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
] as const;

const JSON_SCHEMA_DESC = `Respond with ONLY a single JSON object (no markdown, no code fences, no other text). Use this exact shape:
{
  "rightNow": "One to two sentences max. The single most important physical action to take immediately.",
  "sections": [
    { "title": "What's happening", "content": "..." },
    { "title": "Next steps", "content": "..." },
    { "title": "What to say", "content": "..." }
  ]
}
Rules: rightNow must be immediately actionable and calm. Each section content is 1-3 sentences max. High-signal only; no filler.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_AI_API_KEY not set");
      return NextResponse.json(
        { error: "API configuration error. Please check server settings." },
        { status: 500 }
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
    const { allowed, count, remaining } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "daily_limit_reached", message: `You've used your ${FREE_DAILY_LIMIT} free sessions for today.`, count, remaining: 0 },
        { status: 429, headers: { "X-RateLimit-Limit": String(FREE_DAILY_LIMIT), "X-RateLimit-Remaining": "0" } }
      );
    }

    const body = await request.json();
    const { situation = "", dial = "balanced" } = body as {
      situation?: string;
      dial?: DialValue;
    };

    // Input validation
    const situationStr = typeof situation === "string" ? situation.trim() : "";
    if (situationStr.length > 2000) {
      return NextResponse.json(
        { error: "Your message is too long. Please shorten it to under 2000 characters." },
        { status: 400 }
      );
    }
    const safeDial: DialValue =
      dial === "more-empathy" || dial === "more-direct" ? dial : "balanced";

    // Basic safety: reject clearly harmful or off-topic queries (minimal list to avoid false positives)
    const lower = situationStr.toLowerCase();
    const blocked =
      /\b(how to (hurt|harm|hit|punish physically|abuse)|kill|self[- ]harm)\b/.test(lower) ||
      /(\b(illegal|weapon|drug)\b.*\b(child|kid|toddler)\b)/.test(lower);
    if (blocked) {
      return NextResponse.json(
        { error: "This app offers parenting support only. If you or your child are in danger, please contact emergency services or a crisis line." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const toneInstruction = TONE_PROMPTS[safeDial] ?? TONE_PROMPTS.balanced;
    const situationText = situationStr
      ? `Situation: ${situationStr.slice(0, 500)}`
      : "Parent needs general support during a difficult moment.";

    const matchedScenario = findBestScenario(situationStr);
    const scenarioContext = matchedScenario
      ? `You are grounded in Dr Dan Siegel's "connect before redirect" framework and rupture-and-repair attachment science.

SITUATION: ${matchedScenario.title}
CHILD AGE RANGE: ${matchedScenario.child_age_range}

WHAT'S HAPPENING IN THE CHILD'S BRAIN: ${matchedScenario.brain_state}

DEVELOPMENTAL CONTEXT: ${matchedScenario.developmental_why}

CONNECT FIRST (do these before anything else):
${matchedScenario.connect_first.map((s) => `- ${s}`).join("\n")}

THEN REDIRECT (only once the child is calmer):
${matchedScenario.then_redirect.map((s) => `- ${s}`).join("\n")}

WHAT NOT TO DO: ${matchedScenario.what_not_to_do}
WHY IT BACKFIRES: ${matchedScenario.why_it_backfires}

REPAIR SCRIPT (if the parent lost their cool):
${matchedScenario.repair_script.map((s) => `- ${s}`).join("\n")}

LONG-TERM SIGNAL THIS SENDS: ${matchedScenario.long_term_signal}`
      : "";

    const prompt = `You are a trauma-informed parenting coach. Output only valid JSON.

${scenarioContext ? scenarioContext + "\n\n" : ""}${JSON_SCHEMA_DESC}

${toneInstruction}

${situationText}

Reply with only the JSON object.`;

    let lastError: unknown = null;
    for (const modelId of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelId });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let raw = response.text().trim();

        // Strip optional markdown code fence so we get raw JSON
        const jsonMatch = raw.match(/^```(?:json)?\s*([\s\S]*?)```$/);
        if (jsonMatch) raw = jsonMatch[1].trim();

        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return NextResponse.json({
            guidance: getFallbackGuidanceResult(),
            dial: safeDial,
            situation: situationStr.slice(0, 200),
            modelId,
            fallback: true,
            remaining,
          }, { headers: { "X-RateLimit-Limit": String(FREE_DAILY_LIMIT), "X-RateLimit-Remaining": String(remaining) } });
        }

        const guidance = validateGuidanceResult(parsed);

        return NextResponse.json({
          guidance,
          dial: safeDial,
          situation: situationStr.slice(0, 200),
          modelId,
          remaining,
        }, { headers: { "X-RateLimit-Limit": String(FREE_DAILY_LIMIT), "X-RateLimit-Remaining": String(remaining) } });
      } catch (err) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (/404|not found|is not supported/i.test(msg)) continue;
        if (/429|rate.?limit|resource.?exhaust|quota/i.test(msg)) continue;
        throw err;
      }
    }

    // If all models failed — check if rate-limited and return fallback rather than error
    const finalMsg = lastError instanceof Error ? lastError.message : String(lastError);
    if (/429|rate.?limit|resource.?exhaust|quota/i.test(finalMsg)) {
      console.warn("All Gemini models rate-limited — returning fallback guidance");
      return NextResponse.json({
        guidance: getFallbackGuidanceResult(),
        dial: safeDial,
        situation: situationStr.slice(0, 200),
        fallback: true,
        remaining,
      }, { headers: { "X-RateLimit-Limit": String(FREE_DAILY_LIMIT), "X-RateLimit-Remaining": String(remaining) } });
    }
    throw new Error(
      `No supported Gemini model found for this API key. Last error: ${finalMsg}`
    );
  } catch (e) {
    console.error("Error calling Gemini API:", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? `Unable to generate guidance: ${e.message}`
            : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
