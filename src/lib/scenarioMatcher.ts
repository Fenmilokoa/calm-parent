import { SCENARIOS, Scenario } from "@/data/scenarios";

export function findBestScenario(userInput: string): Scenario | null {
  if (!userInput || userInput.trim().length < 3) return null;

  const input = userInput.toLowerCase();
  let bestMatch: Scenario | null = null;
  let bestScore = 0;

  for (const scenario of SCENARIOS) {
    let score = 0;
    for (const keyword of scenario.keywords) {
      if (input.includes(keyword.toLowerCase())) score += 2;
    }
    // Partial word matching for common roots
    const words = input.split(/\s+/);
    for (const word of words) {
      for (const keyword of scenario.keywords) {
        if (word.length > 4 && keyword.toLowerCase().startsWith(word)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = scenario;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}
