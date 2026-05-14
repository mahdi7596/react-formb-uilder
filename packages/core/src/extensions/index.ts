import type { JsonObject, JsonValue } from "../schema/index.js";

export interface CustomFieldRegistration {
  key: string;
  version: string;
  configContract: JsonObject;
  valueContract: JsonObject;
  defaultValue?: JsonValue;
  backendParityRequired: boolean;
  supportsJsonSchema: boolean;
}

export interface CustomValidatorRegistration {
  key: string;
  version: string;
  fieldTypes: string[];
  paramsContract: JsonObject;
  backendParityRequired: boolean;
  async: false;
}

export interface CustomPredicateRegistration {
  key: string;
  version: string;
  argsContract: JsonObject;
  dependencies: string[];
  backendParityRequired: boolean;
  async: false;
}
