export type JsonSchemaPrimitiveType = "string" | "number" | "integer" | "boolean" | "object" | "array";

export interface JsonSchemaObject {
  $schema?: "https://json-schema.org/draft/2020-12/schema";
  type?: JsonSchemaPrimitiveType | JsonSchemaPrimitiveType[];
  properties?: Record<string, JsonSchemaObject>;
  items?: JsonSchemaObject;
  required?: string[];
  additionalProperties?: boolean;
  enum?: unknown[];
  format?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  minItems?: number;
  maxItems?: number;
}

export function createRootJsonSchema(): JsonSchemaObject {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    additionalProperties: false,
    properties: {}
  };
}
