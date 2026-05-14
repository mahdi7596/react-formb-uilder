import { describe, expect, it } from "vitest";

import { runMigrations } from "./index.js";

describe("migration runtime", () => {
  it("returns current schemas unchanged", () => {
    const schema = { schemaVersion: "1.0.0", title: "Current" };
    expect(runMigrations(schema).value).toBe(schema);
    expect(runMigrations(schema).diagnostics).toEqual([]);
  });

  it("diagnoses missing or unknown schema versions", () => {
    expect(runMigrations({ title: "Missing" }).diagnostics.map((item) => item.code)).toContain(
      "invalid_submission_envelope"
    );
    expect(runMigrations({ schemaVersion: "9.0.0" }).diagnostics.map((item) => item.code)).toContain(
      "unsupported_compiler_behavior"
    );
  });

  it("runs registered migrations in order", () => {
    const result = runMigrations(
      { schemaVersion: "0.8.0", title: "Old" },
      {
        currentVersion: "1.0.0",
        migrations: [
          { from: "0.8.0", to: "0.9.0", migrate: (schema) => ({ ...schema, schemaVersion: "0.9.0", first: true }) },
          { from: "0.9.0", to: "1.0.0", migrate: (schema) => ({ ...schema, schemaVersion: "1.0.0", second: true }) }
        ]
      }
    );

    expect(result.value).toMatchObject({ schemaVersion: "1.0.0", first: true, second: true });
  });
});
