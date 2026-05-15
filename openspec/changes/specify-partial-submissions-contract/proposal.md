# Specify Partial Submissions Contract

## Why

Partial submissions, drafts, and save-and-continue-later are valuable but need idempotency, privacy, recovery, revision handling, and cleanup rules before implementation.

## What Changes

- Define partial submission envelope and save tokens.
- Define idempotent create/update behavior.
- Define draft expiry, resume, conflict, and published revision compatibility.

## Impact

- Future implementation touches adapters, renderer step lifecycle, persistence docs, security docs, and backend fixtures.

