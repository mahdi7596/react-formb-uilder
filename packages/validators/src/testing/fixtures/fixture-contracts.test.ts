import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { compileJsonSchema } from "../../index.js";
import { validatorFixtureManifest } from "./manifest.js";

const FIXTURE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "json");

describe("json schema compiler fixtures", () => {
  it("loads every fixture and matches expected diagnostics", () => {
    for (const entry of validatorFixtureManifest.fixtures) {
      const schema = JSON.parse(readFileSync(join(FIXTURE_ROOT, entry.input), "utf8")) as unknown;
      const result = compileJsonSchema(schema);

      const diagnosticCodes = [...new Set(result.diagnostics.map((item) => item.code))];

      expect(diagnosticCodes).toEqual(entry.diagnostics);
    }
  });

  it("matches generated schema snapshots for successful fixtures", () => {
    for (const entry of validatorFixtureManifest.fixtures) {
      if (!entry.output) {
        continue;
      }

      const schema = JSON.parse(readFileSync(join(FIXTURE_ROOT, entry.input), "utf8")) as unknown;
      const expected = JSON.parse(readFileSync(join(FIXTURE_ROOT, entry.output), "utf8")) as unknown;

      expect(compileJsonSchema(schema).schema).toEqual(expected);
    }
  });
});
