// Have You Tried Turning It Off? — entry program (program/v1).
//
// Writes one funny line that a hopeless tech support agent gives a
// desperate customer to /output/entry.txt. The sealed gate accepts
// UTF-8 text of 1 to 199 characters, not only white space; the bounty
// brief asks for a single line under 200 characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 199;
const EXPECTED_CHARS = 71;

// The entry line. The classic reboot advice, turned back on the human:
// the machine was never the broken part.
const ENTRY_TEXT =
  "Have you tried turning yourself off and on again? The computer is fine.";

function fail(reason: string): never {
  throw new Error(`entry gate: ${reason}`);
}

function guardEntryText(text: string): void {
  const chars = Array.from(text);
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    fail(`text is ${chars.length} characters; gate allows ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (chars.length !== EXPECTED_CHARS) {
    fail(`text must stay exactly ${EXPECTED_CHARS} characters; got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    fail("text must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("text must be a single line");
  }
  for (const ch of chars) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      fail(`control character U+${code.toString(16).padStart(4, "0")} in text`);
    }
  }
}

function main(): void {
  guardEntryText(ENTRY_TEXT);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY_TEXT, "utf8");
  const onDisk = readFileSync(OUTPUT_PATH, "utf8");
  if (onDisk !== ENTRY_TEXT) {
    fail("read-back mismatch: /output/entry.txt differs from the entry text");
  }
  console.log(`Wrote ${Array.from(ENTRY_TEXT).length} characters to ${OUTPUT_PATH}`);
}

main();
