import type { JsonObject } from "../schema/index.js";

export interface FileMetadata {
  field: string;
  fileId: string;
  name?: string;
  mimeType?: string;
  size?: number;
  meta?: JsonObject;
}

export interface SubmissionEnvelope {
  formId: string;
  revisionId: string;
  revisionHash: string;
  schemaVersion: string;
  submissionAttemptId: string;
  submittedAt: string;
  locale: string;
  data: JsonObject;
  files: FileMetadata[];
  meta?: JsonObject;
}
