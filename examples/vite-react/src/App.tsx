import { useCallback, useEffect, useMemo, useState } from "react";
import type { BackendResponse, SubmissionEnvelope } from "@your-org/forms-core";
import type { CanonicalFormSchema, PublishedRevisionMetadata } from "@your-org/forms-adapters";
import {
  BuilderWorkspace,
  buildPublishChecklist,
  createPersistenceState,
  type BuilderPersistenceState,
  type BuilderSchema
} from "@your-org/forms-react-builder";
import { FormRenderer } from "@your-org/forms-react-renderer";
import { createDefaultThemeStyles } from "@your-org/forms-themes";
import { createBuilderArtifactBundle } from "@your-org/forms-validators";

import {
  createFakePersistenceHost,
  createFakeSubmissionAdapter,
  prettyJson,
  type BackendScenario
} from "./fakeBackend.js";
import { examples, type ExampleMode } from "./schemas.js";

const modeOrder: ExampleMode[] = ["single", "validation", "multi", "rtl"];
const scenarioOrder: BackendScenario[] = ["success", "validation_error", "conflict", "auth_error", "rate_limited", "server_error"];

const scenarioLabels: Record<BackendScenario, string> = {
  success: "Success",
  validation_error: "Validation error",
  conflict: "Conflict",
  auth_error: "Auth error",
  rate_limited: "Rate limited",
  server_error: "Server error"
};

export function App() {
  const [mode, setMode] = useState<ExampleMode>("single");
  const [scenario, setScenario] = useState<BackendScenario>("success");
  const [lastEnvelope, setLastEnvelope] = useState<SubmissionEnvelope | null>(null);
  const [lastResponse, setLastResponse] = useState<BackendResponse | null>(null);
  const [builderSchema, setBuilderSchema] = useState<BuilderSchema>(() => draftBuilderSchema(examples.single.schema));
  const [persistenceState, setPersistenceState] = useState<BuilderPersistenceState>(() => createPersistenceState("idle"));
  const [latestPublished, setLatestPublished] = useState<PublishedRevisionMetadata | null>(null);

  const example = examples[mode];
  const fakeHost = useMemo(() => createFakePersistenceHost(draftBuilderSchema(example.schema) as CanonicalFormSchema), [example.schema]);
  const activeScenario = mode === "validation" && scenario === "success" ? "validation_error" : scenario;
  const direction = example.schema.direction === "rtl" ? "rtl" : "ltr";
  const artifactBundle = useMemo(() => createBuilderArtifactBundle(builderSchema, { generatedAt: "deterministic" }), [builderSchema]);
  const publishChecklist = useMemo(
    () => buildPublishChecklist({ schema: builderSchema, artifactBundle, latestPublished }),
    [artifactBundle, builderSchema, latestPublished]
  );

  useEffect(() => {
    setLastEnvelope(null);
    setLastResponse(null);
    setBuilderSchema(draftBuilderSchema(example.schema));
    setPersistenceState(createPersistenceState("idle"));
    setLatestPublished(null);
    if (mode === "validation") {
      setScenario("validation_error");
    }
  }, [example.schema, mode]);

  const handleSubmit = useMemo(
    () =>
      createFakeSubmissionAdapter({
        scenario: activeScenario,
        validationPath: example.validationPath,
        onEnvelope: setLastEnvelope,
        onResponse: setLastResponse
      }),
    [activeScenario, example.validationPath]
  );

  const selectMode = useCallback((nextMode: ExampleMode) => {
    setMode(nextMode);
  }, []);

  const saveDraft = useCallback(async (currentSchema: BuilderSchema = builderSchema) => {
    setPersistenceState(createPersistenceState("saving"));
    const result = await fakeHost.adapter.saveDraft({
      formId: currentSchema.formId,
      schema: currentSchema as CanonicalFormSchema,
      draft: {
        draftId: "draft_example_001",
        revisionId: currentSchema.revisionId,
        revisionHash: currentSchema.revisionHash
      }
    });
    if (result.ok) {
      setBuilderSchema(result.data.schema as BuilderSchema);
      setPersistenceState(createPersistenceState("saved", {
        draft: result.data.draft,
        lastSavedAt: result.data.savedAt,
        message: "Draft saved in the fake host adapter."
      }));
      return;
    }
    setPersistenceState(createPersistenceState(result.status === "conflict" ? "conflicted" : "failed", {
      diagnostics: result.diagnostics,
      ...(result.message ? { message: result.message } : {}),
      canReload: result.conflict?.canReload ?? false,
      canRetry: result.conflict?.canRetry ?? true
    }));
  }, [builderSchema, fakeHost]);

  const publishRevision = useCallback(async (currentSchema: BuilderSchema = builderSchema) => {
    const result = await fakeHost.adapter.publishRevision({
      formId: currentSchema.formId,
      schema: currentSchema as CanonicalFormSchema,
      draft: {
        draftId: "draft_example_001",
        revisionId: currentSchema.revisionId,
        revisionHash: currentSchema.revisionHash
      }
    });
    if (result.ok) {
      setBuilderSchema(result.data.schema as BuilderSchema);
      setLatestPublished(result.data.published);
      setPersistenceState(createPersistenceState("saved", {
        message: `Published ${result.data.published.revisionId}.`,
        lastSavedAt: result.data.published.publishedAt
      }));
      return;
    }
    setPersistenceState(createPersistenceState(result.status === "conflict" ? "conflicted" : "failed", {
      diagnostics: result.diagnostics,
      ...(result.message ? { message: result.message } : {})
    }));
  }, [builderSchema, fakeHost]);

  const forceSaveConflict = useCallback(() => {
    fakeHost.forceNextSaveConflict();
    setPersistenceState(createPersistenceState("dirty", { message: "Next save will simulate a stale draft conflict." }));
  }, [fakeHost]);

  const forcePublishConflict = useCallback(() => {
    fakeHost.forceNextPublishConflict();
    setPersistenceState(createPersistenceState("dirty", { message: "Next publish will simulate a host conflict." }));
  }, [fakeHost]);

  return (
    <main className="example-shell">
      <style>{createDefaultThemeStyles({ selector: ":root" })}</style>
      <header className="example-header">
        <div>
          <p className="eyebrow">Phase 6 renderer proof</p>
          <h1>Vite React renderer example</h1>
          <p>
            A host-style app that renders canonical published schemas with the real
            <code> FormRenderer</code>, fake backend responses, and browser-testable output.
          </p>
        </div>
      </header>

      <section className="mode-bar" aria-label="Example modes">
        {modeOrder.map((item) => (
          <button
            className={item === mode ? "mode-button active" : "mode-button"}
            key={item}
            type="button"
            aria-pressed={item === mode}
            onClick={() => selectMode(item)}
          >
            {examples[item].label}
          </button>
        ))}
      </section>

      <div className="workspace">
        <section className="builder-panel" aria-labelledby="builder-example-title">
          <div className="example-context">
            <p className="eyebrow">Phase 10 builder persistence</p>
            <h2 id="builder-example-title">Builder save and publish workflow</h2>
            <p>Fake host persistence exercises draft save, conflict recovery, publish gating, revision review, and generated artifacts.</p>
          </div>
          <div className="builder-actions">
            <button type="button" onClick={forceSaveConflict}>Simulate save conflict</button>
            <button type="button" onClick={forcePublishConflict}>Simulate publish conflict</button>
          </div>
          <BuilderWorkspace
            className="builder-theme-override"
            schema={builderSchema}
            persistenceState={persistenceState}
            publishChecklist={publishChecklist}
            artifactBundle={artifactBundle}
            latestPublishedRevision={latestPublished}
            onSaveDraft={saveDraft}
            onRetrySave={saveDraft}
            onReloadLatest={() => setPersistenceState(createPersistenceState("loading", { message: "Reload simulated by the fake host." }))}
            onPreserveLocalEdits={() => setPersistenceState(createPersistenceState("dirty", { message: "Local edits preserved." }))}
            onPublish={publishRevision}
          />
        </section>

        <section className="form-panel" aria-labelledby="active-example-title" dir={direction}>
          <div className="example-context">
            <p className="eyebrow">Current mode</p>
            <h2 id="active-example-title">{example.label}</h2>
            <p>{example.description}</p>
          </div>

          <FormRenderer
            className="host-theme-override"
            key={`${mode}:${activeScenario}`}
            schema={example.schema}
            onSubmit={handleSubmit}
            meta={{ exampleMode: mode, backendScenario: activeScenario }}
          />
        </section>

        <aside className="debug-panel" aria-label="Example controls and submission debug">
          <label className="control-label" htmlFor="backend-scenario">
            Backend response scenario
          </label>
          <select
            id="backend-scenario"
            value={activeScenario}
            onChange={(event) => setScenario(event.currentTarget.value as BackendScenario)}
          >
            {scenarioOrder.map((item) => (
              <option key={item} value={item}>
                {scenarioLabels[item]}
              </option>
            ))}
          </select>

          <div className="debug-card">
            <h3>Last normalized envelope</h3>
            <pre data-testid="last-envelope">{prettyJson(lastEnvelope)}</pre>
          </div>

          <div className="debug-card">
            <h3>Last backend response</h3>
            <pre data-testid="last-response">{prettyJson(lastResponse)}</pre>
          </div>
        </aside>
      </div>
    </main>
  );
}

function draftBuilderSchema(schema: unknown): BuilderSchema {
  const copy = JSON.parse(JSON.stringify(schema)) as BuilderSchema;
  return {
    ...copy,
    status: "draft",
    revisionId: copy.revisionId?.replace("rev_", "draft_") ?? "draft_example",
    revisionHash: copy.revisionHash?.replace("sha256:", "sha256:draft-") ?? "sha256:draft-example"
  };
}
