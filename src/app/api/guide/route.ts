import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  type GuidanceResponse,
  validateGuidanceResponse,
  getFallbackGuidance,
} from "@/lib/guidance-types";

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
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-1.5-pro-latest",
  "gemini-2.0-flash",
] as const;

const JSON_SCHEMA_DESC = `Respond with ONLY a single JSON object (no markdown, no code fences, no other text). Use this exact shape:
{
  "title": "short headline (one phrase)",
  "right_now": ["bullet 1", "bullet 2"],
  "say_this": ["exact phrase 1", "phrase 2"],
  "do_this": ["action 1", "action 2"],
  "avoid": ["avoid 1", "avoid 2"],
  "next_time": ["tip 1", "tip 2"],
  "reassurance": "one short sentence for the parent"
}
Rules: Keep each array to 2-5 short bullets. One sentence for reassurance. High-signal only; no filler.`;

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

    const body = await request.json();
    const { situation = "", dial = "balanced" } = body as {
      situation?: string;
      dial?: DialValue;
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const toneInstruction = TONE_PROMPTS[dial] ?? TONE_PROMPTS.balanced;
    const situationText = situation.trim()
      ? `Situation: ${situation.trim().slice(0, 300)}`
      : "Parent needs general support during a difficult moment.";

    const prompt = `You are a trauma-informed parenting coach. Output only valid JSON.

${JSON_SCHEMA_DESC}

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
        } catch (parseErr) {
          console.warn("Guide API: JSON parse failed, using fallback", parseErr);
          return NextResponse.json({
            guidance: getFallbackGuidance(),
            dial,
            situation: situation.slice(0, 200),
            modelId,
            fallback: true,
          });
        }

        const guidance = validateGuidanceResponse(parsed);

        return NextResponse.json({
          guidance,
          dial,
          situation: situation.slice(0, 200),
          modelId,
        });
      } catch (err) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (/404|not found|is not supported/i.test(msg)) continue;
        throw err;
      }
    }

    const finalMsg =
      lastError instanceof Error ? lastError.message : String(lastError);
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
