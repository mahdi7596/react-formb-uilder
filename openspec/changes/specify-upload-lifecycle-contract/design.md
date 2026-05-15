# Design

## Lifecycle

States:

- `idle`
- `preparing`
- `prepared`
- `uploading`
- `uploaded`
- `finalizing`
- `scanning`
- `accepted`
- `rejected`
- `failed`
- `abandoned`

Flow:

1. Renderer asks host adapter to prepare an upload.
2. Host backend returns an upload target and temporary upload id.
3. Browser uploads to the target.
4. Renderer asks host backend to finalize.
5. Backend returns trusted file metadata.
6. Submission includes only trusted metadata/file ids.

## Security

- Frontend MIME/size checks are hints only.
- Backend enforces MIME, extension, size, count, auth, retention, and scan result.
- Submitted schemas never store provider secrets or presigned URLs.
- File references cannot be reused across unauthorized submissions.

