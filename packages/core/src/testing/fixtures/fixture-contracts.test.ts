import { describe, expect, it } from "vitest";

import { DIAGNOSTIC_CODES } from "../../diagnostics/index.js";
import {
  checkFixtureContract,
  fixtureManifest,
  loadFixtureEntries
} from "./index.js";

describe("core conformance fixtures", () => {
  it("loads every manifest fixture from JSON", () => {
    const entries = loadFixtureEntries();

    expect(entries).toHaveLength(fixtureManifest.fixtures.length);
    for (const entry of entries) {
      expect(entry.data).toBeTruthy();
      expect(entry.manifestEntry.id).toBeTruthy();
    }
  });

  it("keeps passing fixtures free of expected diagnostics", () => {
    for (const entry of loadFixtureEntries()) {
      if (entry.manifestEntry.expect === "pass") {
        expect(entry.manifestEntry.diagnostics).toEqual([]);
        expect(checkFixtureContract(entry).map((diagnostic) => diagnostic.code)).toEqual([]);
      }
    }
  });

  it("reports expected diagnostic codes for failing fixtures", () => {
    for (const entry of loadFixtureEntries()) {
      if (entry.manifestEntry.expect === "fail") {
        const actualCodes = checkFixtureContract(entry).map((diagnostic) => diagnostic.code);

        expect(actualCodes).toEqual(entry.manifestEntry.diagnostics);
      }
    }
  });

  it("defines stable diagnostic codes for contract coverage", () => {
    expect(DIAGNOSTIC_CODES.dangerousKey).toBe("dangerous_key");
    expect(DIAGNOSTIC_CODES.invalidSubmittedPath).toBe("invalid_submitted_path");
    expect(DIAGNOSTIC_CODES.unsupportedCompilerBehavior).toBe(
      "unsupported_compiler_behavior"
    );
  });
});
