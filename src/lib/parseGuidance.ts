export type GuidanceSection = {
  title: string;
  lines: string[];
};

function normalizeLine(line: string) {
  return line
    .replace(/\r/g, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\u201c|\u201d/g, "\"")
    .replace(/\u2018|\u2019/g, "'");
}

export function parseGuidance(raw: string): GuidanceSection[] {
  const text = (raw || "").trim();
  if (!text) return [];

  const lines = text.split("\n").map(normalizeLine);

  const sections: GuidanceSection[] = [];
  let current: GuidanceSection | null = null;

  const pushCurrent = () => {
    if (!current) return;
    const cleaned = current.lines.filter(Boolean);
    if (cleaned.length === 0) return;
    sections.push({ title: current.title, lines: cleaned });
  };

  for (const line of lines) {
    if (!line) continue;

    // Match markdown bold header like **Right now:** ...
    const headerMatch = line.match(/^\*\*([^*]+)\*\*\s*:?\s*(.*)$/);
    if (headerMatch) {
      pushCurrent();
      current = {
        title: headerMatch[1].replace(/:$/, "").trim(),
        lines: headerMatch[2] ? [headerMatch[2]] : [],
      };
      continue;
    }

    // If the model gave "Title:" without markdown
    const colonHeader = line.match(/^([A-Za-z][A-Za-z\s]{2,30})\:\s*(.*)$/);
    if (colonHeader && /right now|what to say|what helps|after|steps/i.test(colonHeader[1])) {
      pushCurrent();
      current = {
        title: colonHeader[1].trim(),
        lines: colonHeader[2] ? [colonHeader[2]] : [],
      };
      continue;
    }

    if (!current) {
      current = { title: "Guidance", lines: [] };
    }
    current.lines.push(line);
  }

  pushCurrent();

  return sections;
}

