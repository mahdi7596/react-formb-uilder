# Specify Upload Lifecycle Contract

## Why

File upload is a table-stakes form builder feature, but browser uploads require backend trust, provider adapters, cleanup, finalization, scanning, and privacy rules. The current product safely supports metadata-only file references; Phase 20 defines the full lifecycle before implementation.

## What Changes

- Define prepare, upload, finalize, scan, accept/reject, abandon, and cleanup states.
- Define trusted file metadata and submission attachment shape.
- Define package boundaries for `packages/uploads`, adapters, renderer, builder, and core.

## Impact

- Future implementation adds `packages/uploads` behavior and adapter helpers.
- `packages/core` may own trusted metadata types, but never provider SDKs or browser upload orchestration.

