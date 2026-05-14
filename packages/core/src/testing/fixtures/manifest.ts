import type { FixtureManifest } from "./types.js";

export const fixtureManifest = {
  version: "1.0.0",
  fixtures: [
    {
      id: "schema.valid.minimal-contact",
      category: "schema",
      path: "schema/valid/minimal-contact.json",
      expect: "pass",
      diagnostics: [],
      description: "Minimal draft contact form schema."
    },
    {
      id: "schema.valid.multi-step",
      category: "schema",
      path: "schema/valid/multi-step.json",
      expect: "pass",
      diagnostics: [],
      description: "Multi-step form shape using step containers."
    },
    {
      id: "schema.valid.choices",
      category: "schema",
      path: "schema/valid/choices.json",
      expect: "pass",
      diagnostics: [],
      description: "Choice field with explicit option contracts."
    },
    {
      id: "schema.valid.hidden-default-exclusion",
      category: "schema",
      path: "schema/valid/hidden-default-exclusion.json",
      expect: "pass",
      diagnostics: [],
      description: "Hidden field with default exclusion policy."
    },
    {
      id: "schema.valid.localization",
      category: "schema",
      path: "schema/valid/localization.json",
      expect: "pass",
      diagnostics: [],
      description: "Localized title and field labels."
    },
    {
      id: "schema.valid.conditional-visibility",
      category: "schema",
      path: "schema/valid/conditional-visibility.json",
      expect: "pass",
      diagnostics: [],
      description: "Visibility condition referencing a known submitted path."
    },
    {
      id: "schema.valid.file-metadata",
      category: "schema",
      path: "schema/valid/file-metadata.json",
      expect: "pass",
      diagnostics: [],
      description: "File metadata reference without upload orchestration."
    },
    {
      id: "schema.valid.custom-validator-reference",
      category: "schema",
      path: "schema/valid/custom-validator-reference.json",
      expect: "pass",
      diagnostics: [],
      description: "Custom validator reference with explicit registration."
    },
    {
      id: "schema.invalid.missing-schema-version",
      category: "schema",
      path: "schema/invalid/missing-schema-version.json",
      expect: "fail",
      diagnostics: ["invalid_submission_envelope"],
      description: "Schema fixture missing schemaVersion."
    },
    {
      id: "schema.invalid.duplicate-node-ids",
      category: "schema",
      path: "schema/invalid/duplicate-node-ids.json",
      expect: "fail",
      diagnostics: ["duplicate_node_id"],
      description: "Schema fixture with duplicate node ids."
    },
    {
      id: "schema.invalid.unknown-node-type",
      category: "schema",
      path: "schema/invalid/unknown-node-type.json",
      expect: "fail",
      diagnostics: ["unknown_node_type"],
      description: "Schema fixture with unknown node type."
    },
    {
      id: "schema.invalid.unknown-field-type",
      category: "schema",
      path: "schema/invalid/unknown-field-type.json",
      expect: "fail",
      diagnostics: ["unknown_field_type"],
      description: "Schema fixture with unknown field type."
    },
    {
      id: "schema.invalid.missing-submitted-name",
      category: "schema",
      path: "schema/invalid/missing-submitted-name.json",
      expect: "fail",
      diagnostics: ["invalid_submitted_path"],
      description: "Field node missing submitted path name."
    },
    {
      id: "schema.invalid.invalid-submitted-path",
      category: "schema",
      path: "schema/invalid/invalid-submitted-path.json",
      expect: "fail",
      diagnostics: ["invalid_submitted_path"],
      description: "Field node using an invalid submitted path."
    },
    {
      id: "schema.invalid.dangerous-key",
      category: "schema",
      path: "schema/invalid/dangerous-key.json",
      expect: "fail",
      diagnostics: ["dangerous_key"],
      description: "Schema object includes a dangerous prototype key."
    },
    {
      id: "schema.invalid.duplicate-submitted-path",
      category: "schema",
      path: "schema/invalid/duplicate-submitted-path.json",
      expect: "fail",
      diagnostics: ["duplicate_submitted_path"],
      description: "Two fields write to the same submitted path."
    },
    {
      id: "schema.invalid.unknown-validation-rule",
      category: "schema",
      path: "schema/invalid/unknown-validation-rule.json",
      expect: "fail",
      diagnostics: ["unknown_validation_rule"],
      description: "Field uses an unknown validation rule."
    },
    {
      id: "schema.invalid.unsupported-custom-validator",
      category: "schema",
      path: "schema/invalid/unsupported-custom-validator.json",
      expect: "fail",
      diagnostics: ["unsupported_custom_registration"],
      description: "Custom validator is referenced without registration."
    },
    {
      id: "schema.invalid.invalid-condition-reference",
      category: "schema",
      path: "schema/invalid/invalid-condition-reference.json",
      expect: "fail",
      diagnostics: ["invalid_condition"],
      description: "Condition references an unknown submitted path."
    },
    {
      id: "schema.invalid.condition-cycle",
      category: "schema",
      path: "schema/invalid/condition-cycle.json",
      expect: "fail",
      diagnostics: ["condition_cycle"],
      description: "Conditions form a dependency cycle."
    },
    {
      id: "schema.invalid.repeater-node",
      category: "schema",
      path: "schema/invalid/repeater-node.json",
      expect: "fail",
      diagnostics: ["repeater_not_supported"],
      description: "Repeater nodes are explicitly outside this phase."
    },
    {
      id: "schema.invalid.upload-orchestration-node",
      category: "schema",
      path: "schema/invalid/upload-orchestration-node.json",
      expect: "fail",
      diagnostics: ["upload_lifecycle_not_supported"],
      description: "Upload orchestration is not a core schema behavior."
    },
    {
      id: "schema.invalid.executable-code-attempt",
      category: "schema",
      path: "schema/invalid/executable-code-attempt.json",
      expect: "fail",
      diagnostics: ["executable_code_prohibited"],
      description: "Persisted schema attempts to store executable code."
    },
    {
      id: "submission.valid.minimal-contact",
      category: "submission",
      path: "submission/valid/minimal-contact.json",
      expect: "pass",
      diagnostics: [],
      description: "Minimal contact submission envelope."
    },
    {
      id: "submission.valid.omitted-empty-values",
      category: "submission",
      path: "submission/valid/omitted-empty-values.json",
      expect: "pass",
      diagnostics: [],
      description: "Optional empty values omitted from data."
    },
    {
      id: "submission.valid.boolean-false",
      category: "submission",
      path: "submission/valid/boolean-false.json",
      expect: "pass",
      diagnostics: [],
      description: "Boolean false is preserved as a real value."
    },
    {
      id: "submission.valid.choices",
      category: "submission",
      path: "submission/valid/choices.json",
      expect: "pass",
      diagnostics: [],
      description: "Choice submission with known option value."
    },
    {
      id: "submission.valid.hidden-excluded",
      category: "submission",
      path: "submission/valid/hidden-excluded.json",
      expect: "pass",
      diagnostics: [],
      description: "Hidden values excluded by policy."
    },
    {
      id: "submission.valid.hidden-preserved",
      category: "submission",
      path: "submission/valid/hidden-preserved.json",
      expect: "pass",
      diagnostics: [],
      description: "Hidden values preserved by policy."
    },
    {
      id: "submission.valid.file-metadata",
      category: "submission",
      path: "submission/valid/file-metadata.json",
      expect: "pass",
      diagnostics: [],
      description: "Submission includes normalized file metadata."
    },
    {
      id: "submission.valid.idempotent-retry",
      category: "submission",
      path: "submission/valid/idempotent-retry.json",
      expect: "pass",
      diagnostics: [],
      description: "Submission retry keeps stable attempt id."
    },
    {
      id: "submission.invalid.missing-revision-hash",
      category: "submission",
      path: "submission/invalid/missing-revision-hash.json",
      expect: "fail",
      diagnostics: ["invalid_submission_envelope"],
      description: "Submission envelope missing revisionHash."
    },
    {
      id: "submission.invalid.mismatched-revision-hash",
      category: "submission",
      path: "submission/invalid/mismatched-revision-hash.json",
      expect: "fail",
      diagnostics: ["revision_hash_mismatch"],
      description: "Submission revision hash does not match expected context."
    },
    {
      id: "submission.invalid.missing-attempt-id",
      category: "submission",
      path: "submission/invalid/missing-attempt-id.json",
      expect: "fail",
      diagnostics: ["invalid_submission_envelope"],
      description: "Submission envelope missing submissionAttemptId."
    },
    {
      id: "submission.invalid.dangerous-data-key",
      category: "submission",
      path: "submission/invalid/dangerous-data-key.json",
      expect: "fail",
      diagnostics: ["dangerous_key"],
      description: "Submission data contains dangerous prototype key."
    },
    {
      id: "submission.invalid.dangerous-meta-key",
      category: "submission",
      path: "submission/invalid/dangerous-meta-key.json",
      expect: "fail",
      diagnostics: ["dangerous_key"],
      description: "Submission meta contains dangerous prototype key."
    },
    {
      id: "submission.invalid.invalid-path",
      category: "submission",
      path: "submission/invalid/invalid-path.json",
      expect: "fail",
      diagnostics: ["invalid_submitted_path"],
      description: "Submission data includes an invalid submitted path."
    },
    {
      id: "submission.invalid.required-missing",
      category: "submission",
      path: "submission/invalid/required-missing.json",
      expect: "fail",
      diagnostics: ["missing_required_field"],
      description: "Submission omits a required path declared by test metadata."
    },
    {
      id: "submission.invalid.invalid-email",
      category: "submission",
      path: "submission/invalid/invalid-email.json",
      expect: "fail",
      diagnostics: ["invalid_email"],
      description: "Submission email value is malformed."
    },
    {
      id: "submission.invalid.invalid-url",
      category: "submission",
      path: "submission/invalid/invalid-url.json",
      expect: "fail",
      diagnostics: ["invalid_url"],
      description: "Submission URL value is malformed."
    },
    {
      id: "submission.invalid.invalid-option",
      category: "submission",
      path: "submission/invalid/invalid-option.json",
      expect: "fail",
      diagnostics: ["invalid_option"],
      description: "Submission choice value is outside known options."
    },
    {
      id: "submission.invalid.invalid-file-metadata",
      category: "submission",
      path: "submission/invalid/invalid-file-metadata.json",
      expect: "fail",
      diagnostics: ["invalid_file_metadata"],
      description: "Submission file metadata is incomplete."
    },
    {
      id: "submission.invalid.hidden-value-excluded",
      category: "submission",
      path: "submission/invalid/hidden-value-excluded.json",
      expect: "fail",
      diagnostics: ["hidden_value_excluded"],
      description: "Hidden value appears when policy excludes hidden values."
    },
    {
      id: "response.valid.success",
      category: "response",
      path: "response/success.json",
      expect: "pass",
      diagnostics: [],
      description: "Successful backend response."
    },
    {
      id: "response.valid.field-validation-error",
      category: "response",
      path: "response/field-validation-error.json",
      expect: "pass",
      diagnostics: [],
      description: "Field validation error response."
    },
    {
      id: "response.valid.global-validation-error",
      category: "response",
      path: "response/global-validation-error.json",
      expect: "pass",
      diagnostics: [],
      description: "Global validation error response."
    },
    {
      id: "response.valid.mixed-validation-errors",
      category: "response",
      path: "response/mixed-validation-errors.json",
      expect: "pass",
      diagnostics: [],
      description: "Mixed field and global validation errors."
    },
    {
      id: "response.valid.conflict",
      category: "response",
      path: "response/conflict.json",
      expect: "pass",
      diagnostics: [],
      description: "Revision conflict response."
    },
    {
      id: "response.valid.auth-error",
      category: "response",
      path: "response/auth-error.json",
      expect: "pass",
      diagnostics: [],
      description: "Authorization failure response."
    },
    {
      id: "response.valid.rate-limit",
      category: "response",
      path: "response/rate-limit.json",
      expect: "pass",
      diagnostics: [],
      description: "Rate limit response."
    },
    {
      id: "response.valid.server-error",
      category: "response",
      path: "response/server-error.json",
      expect: "pass",
      diagnostics: [],
      description: "Server error response."
    },
    {
      id: "response.invalid.malformed-unknown-status",
      category: "response",
      path: "response/malformed-unknown-status.json",
      expect: "fail",
      diagnostics: ["invalid_backend_response"],
      description: "Backend response with unknown status."
    },
    {
      id: "response.invalid.dangerous-params",
      category: "response",
      path: "response/dangerous-params.json",
      expect: "fail",
      diagnostics: ["dangerous_key"],
      description: "Backend response error params contain dangerous key."
    },
    {
      id: "compiler-diagnostic.condition-not-representable",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/condition-not-representable.json",
      expect: "fail",
      diagnostics: ["condition_not_representable"],
      description: "Condition cannot be represented by JSON Schema."
    },
    {
      id: "compiler-diagnostic.custom-validator-not-representable",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/custom-validator-not-representable.json",
      expect: "fail",
      diagnostics: ["custom_validator_not_representable"],
      description: "Custom validator cannot be represented by JSON Schema."
    },
    {
      id: "compiler-diagnostic.unsupported-regex",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/unsupported-regex.json",
      expect: "fail",
      diagnostics: ["unsupported_regex"],
      description: "Regex is unsupported by the compiler target."
    },
    {
      id: "compiler-diagnostic.unknown-field-type",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/unknown-field-type.json",
      expect: "fail",
      diagnostics: ["unknown_field_type"],
      description: "Compiler sees an unknown field type."
    },
    {
      id: "compiler-diagnostic.repeater-not-supported",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/repeater-not-supported.json",
      expect: "fail",
      diagnostics: ["repeater_not_supported"],
      description: "Compiler target cannot represent repeaters."
    },
    {
      id: "compiler-diagnostic.upload-lifecycle-not-supported",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/upload-lifecycle-not-supported.json",
      expect: "fail",
      diagnostics: ["upload_lifecycle_not_supported"],
      description: "Compiler target cannot represent upload lifecycle behavior."
    },
    {
      id: "compiler-diagnostic.dangerous-key",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/dangerous-key.json",
      expect: "fail",
      diagnostics: ["dangerous_key"],
      description: "Compiler diagnostic for dangerous key rejection."
    },
    {
      id: "compiler-diagnostic.invalid-path",
      category: "compiler-diagnostic",
      path: "compiler-diagnostic/invalid-path.json",
      expect: "fail",
      diagnostics: ["invalid_submitted_path"],
      description: "Compiler diagnostic for invalid submitted path."
    }
  ]
} as const satisfies FixtureManifest;
