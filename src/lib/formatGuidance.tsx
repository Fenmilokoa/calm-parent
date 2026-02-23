import React from "react";

export function formatGuidance(text: string): React.ReactNode[] {
  return text.split("\n").map((line, i) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const re = /\*\*([^*]+)\*\*/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`${i}-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));
    return <p key={i}>{parts}</p>;
  });
}
