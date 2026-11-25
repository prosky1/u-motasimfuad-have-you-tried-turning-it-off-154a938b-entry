// Have You Tried Turning It Off? — entry program (Node 22, runs TypeScript as-is).
// Contract (RULES.txt): write ONE funny line, 1–199 UTF-8 characters, not
// whitespace-only, to /output/entry.txt. The sealed gate then gives Valid 1/0.
// This file was rewritten from the rules alone: its own structure, names and
// comments, with a read-back check so a silent write failure cannot pass.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 199;

// The chosen line: the classic reboot advice, twisted — the agent already did
// it, twice, and that is what broke everything. Exactly 90 characters.
const SUPPORT_LINE =
  "Have you tried turning it off and on again? I have. Twice. That's how your outage started.";

function characterCount(text: string): number {
  // Count Unicode code points, the way a reader counts characters.
  return [...text].length;
}

function gateProblems(text: string): string[] {
  const problems: string[] = [];
  const count = characterCount(text);
  if (count < MIN_CHARS || count > MAX_CHARS) {
    problems.push(`length ${count} outside ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    problems.push("text is blank or whitespace only");
  }
  if (text !== text.trim()) {
    problems.push("text has stray leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("text spans more than one line");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      problems.push("text carries a control character");
      break;
    }
  }
  return problems;
}

function emitEntry(): void {
  const problems = gateProblems(SUPPORT_LINE);
  if (problems.length > 0) {
    throw new Error(`entry refused by local gate: ${problems.join("; ")}`);
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, SUPPORT_LINE, "utf8");
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== SUPPORT_LINE) {
    throw new Error("read-back mismatch: output file does not hold the entry line");
  }
}

emitEntry();
