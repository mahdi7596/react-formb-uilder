import type { Diagnostic } from "../../diagnostics/index.js";

export type FixtureCategory = "schema" | "submission" | "response" | "compiler-diagnostic";

export type FixtureExpectation = "pass" | "fail";

export interface FixtureManifestEntry {
  id: string;
  category: FixtureCategory;
  path: string;
  expect: FixtureExpectation;
  diagnostics: Diagnostic["code"][];
  description: string;
}

export interface FixtureManifest {
  version: "1.0.0";
  fixtures: FixtureManifestEntry[];
}

export interface LoadedFixtureEntry {
  manifestEntry: FixtureManifestEntry;
  data: unknown;
}

export interface FixtureContractResult {
  fixtureId: string;
  diagnostics: Diagnostic[];
}
