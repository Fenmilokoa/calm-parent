# Calm Parent — Real-time parenting guidance

A trauma-informed web app that gives parents gentle, on-demand guidance during tantrums, conflict, refusal, or emotional dysregulation. Built from the product review recommendations: no login gate to start, calm design, and clear value before any sign-in.

## Features

- **Frictionless access** — Use the app immediately. No sign-in required to get your first guidance.
- **Trauma-informed UX** — Calm palette, one clear CTA (“I need guidance now”), undo last action, and visible privacy controls.
- **Calm dial** — Choose how the guidance sounds: more empathy, balanced, or more direct.
- **Breathing wait state** — A short breathing exercise while guidance is prepared, to reduce stress during the wait.
- **Voice input & read aloud** — Describe the situation with your voice; hear the guidance read aloud (hands-free friendly).
- **Progress & freemium** — Free tier: 5 guidance sessions per day. Progress page and upgrade path for unlimited use.
- **Privacy** — Clear copy (“Your data stays private”), expandable privacy summary, and a full privacy page.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No authentication is required.

## Tech stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4**
- **Google Gemini API** (`gemini-1.5-flash`) — Integrated via `@google/generative-ai` SDK
- **API route** at `/api/guide` — Calls Gemini with optimized prompts based on the "calm dial" tone selection

## API Configuration

The app uses Google Gemini API. Your API key is stored in `.env.local`:

```
GOOGLE_AI_API_KEY=your-key-here
```

The API route (`src/app/api/guide/route.ts`) uses:
- **Model:** `gemini-1.5-flash` (cost-effective, fast)
- **Prompt optimization:** Concise system prompt (~100 tokens) + tone instruction + situation
- **Tone adaptation:** The "calm dial" (empathy ↔ direct) adjusts the prompt to match the requested guidance style

To reduce costs further (as recommended in the review):
- Consider caching common prompts/responses
- Use shorter context windows for routine queries
- Implement rate limiting per user

## Project structure

- `src/app/page.tsx` — Main flow: landing → describe → loading (breathing) → result; undo, progress, voice.
- `src/app/api/guide/route.ts` — POST handler for guidance (mock or LLM).
- `src/app/privacy/page.tsx` — Privacy policy.
- `src/app/progress/page.tsx` — Usage and upgrade.
- `src/components/` — CalmDial, BreathingExercise, PrivacyBanner, VoiceControls, ProgressBlock.
- `src/lib/usage.ts` — Local storage for daily free usage count.
- `src/lib/formatGuidance.tsx` — Renders guidance text with bold segments.

## Design tokens (trauma-informed)

Defined in `src/app/globals.css`:

- Background: warm cream (`#f5f3ef`)
- Primary: muted sage green (`#4a7c59`)
- Empathy / direct accents for the calm dial
- Focus ring and reduced-motion support for accessibility

## Monetisation (from review)

- **Free:** 5 guidance sessions per day, no account.
- **Subscription:** Unlimited guidance, progress tracking, expert content (UI ready; integrate Stripe or your provider).
- **No pay-per-use** in crisis; no ads (trust and safety).

## License

Private / unlicensed. Use as a starting point for your own product.
