import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic } from "../diagnostics/index.js";

export interface MigrationEntry {
  from: string;
  to: string;
  migrate: (schema: Record<string, unknown>) => Record<string, unknown>;
}

export interface RunMigrationsOptions {
  currentVersion?: string;
  migrations?: MigrationEntry[];
}

export interface MigrationResult {
  value?: Record<string, unknown>;
  diagnostics: Diagnostic[];
}

export function runMigrations(schema: unknown, options: RunMigrationsOptions = {}): MigrationResult {
  const currentVersion = options.currentVersion ?? "1.0.0";
  if (!isRecord(schema) || typeof schema.schemaVersion !== "string") {
    const result: MigrationResult = {
      diagnostics: [createDiagnostic({ code: DIAGNOSTIC_CODES.invalidSubmissionEnvelope })]
    };
    if (isRecord(schema)) {
      result.value = schema;
    }
    return result;
  }

  if (schema.schemaVersion === currentVersion) {
    return { value: schema, diagnostics: [] };
  }

  let working = schema;
  const diagnostics: Diagnostic[] = [];
  const migrations = [...(options.migrations ?? [])];

  while (working.schemaVersion !== currentVersion) {
    const migration = migrations.find((candidate) => candidate.from === working.schemaVersion);
    if (!migration) {
      diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unsupportedCompilerBehavior }));
      return { value: working, diagnostics };
    }
    working = migration.migrate(working);
    if (working.schemaVersion !== migration.to) {
      working = { ...working, schemaVersion: migration.to };
    }
  }

  return { value: working, diagnostics };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
