export interface ValidatorFixtureManifestEntry {
  id: string;
  input: string;
  output?: string;
  diagnostics: string[];
}

export const validatorFixtureManifest: { fixtures: ValidatorFixtureManifestEntry[] } = {
  fixtures: [
    {
      id: "minimal-email",
      input: "schemas/minimal-email.json",
      output: "generated/minimal-email.schema.json",
      diagnostics: []
    },
    {
      id: "nested-object",
      input: "schemas/nested-object.json",
      output: "generated/nested-object.schema.json",
      diagnostics: []
    },
    {
      id: "choices-required",
      input: "schemas/choices-required.json",
      output: "generated/choices-required.schema.json",
      diagnostics: []
    },
    {
      id: "file-metadata",
      input: "schemas/file-metadata.json",
      output: "generated/file-metadata.schema.json",
      diagnostics: []
    },
    {
      id: "unsupported-behavior",
      input: "schemas/unsupported-behavior.json",
      diagnostics: [
        "unsupported_custom_registration",
        "unknown_field_type",
        "repeater_not_supported",
        "invalid_condition",
        "condition_not_representable",
        "custom_validator_not_representable",
        "unsupported_regex"
      ]
    }
  ]
};
