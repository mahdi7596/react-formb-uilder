export const DIAGNOSTIC_CODES = {
  conditionCycle: "condition_cycle",
  conditionNotRepresentable: "condition_not_representable",
  customValidatorNotRepresentable: "custom_validator_not_representable",
  dangerousKey: "dangerous_key",
  duplicateNodeId: "duplicate_node_id",
  duplicateSubmittedPath: "duplicate_submitted_path",
  executableCodeProhibited: "executable_code_prohibited",
  hiddenValueExcluded: "hidden_value_excluded",
  invalidBackendResponse: "invalid_backend_response",
  invalidCondition: "invalid_condition",
  invalidEmail: "invalid_email",
  invalidFileMetadata: "invalid_file_metadata",
  invalidOption: "invalid_option",
  invalidSubmissionEnvelope: "invalid_submission_envelope",
  invalidSubmittedPath: "invalid_submitted_path",
  invalidUrl: "invalid_url",
  missingRequiredField: "missing_required_field",
  repeaterNotSupported: "repeater_not_supported",
  revisionHashMismatch: "revision_hash_mismatch",
  unknownFieldType: "unknown_field_type",
  unknownNodeType: "unknown_node_type",
  unknownValidationRule: "unknown_validation_rule",
  unsupportedCompilerBehavior: "unsupported_compiler_behavior",
  unsupportedCustomRegistration: "unsupported_custom_registration",
  unsupportedRegex: "unsupported_regex",
  uploadLifecycleNotSupported: "upload_lifecycle_not_supported"
} as const;

export type DiagnosticCode = (typeof DIAGNOSTIC_CODES)[keyof typeof DIAGNOSTIC_CODES];

export type DiagnosticSeverity = "info" | "warning" | "error";

export type DiagnosticSource = "schema" | "client" | "server" | "adapter" | "compiler";

export interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  path: string | null;
  severity: DiagnosticSeverity;
  source: DiagnosticSource;
  meta?: Record<string, unknown>;
}

export function createDiagnostic(input: {
  code: DiagnosticCode;
  message?: string;
  path?: string | null;
  severity?: DiagnosticSeverity;
  source?: DiagnosticSource;
  meta?: Record<string, unknown>;
}): Diagnostic {
  return {
    code: input.code,
    message: input.message ?? input.code,
    path: input.path ?? null,
    severity: input.severity ?? "error",
    source: input.source ?? "schema",
    ...(input.meta ? { meta: input.meta } : {})
  };
}
