import type { JsonObject } from "../schema/index.js";
import type { ValidationErrorContract } from "../validation/index.js";

export type BackendResponseStatus =
  | "success"
  | "validation_error"
  | "server_error"
  | "auth_error"
  | "rate_limited"
  | "conflict";

export interface BackendResponse {
  ok: boolean;
  status: BackendResponseStatus;
  submissionId: string | null;
  errors: ValidationErrorContract[];
  message?: string;
  meta?: JsonObject;
}
