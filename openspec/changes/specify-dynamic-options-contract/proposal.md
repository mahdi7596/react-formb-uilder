# Specify Dynamic Options Contract

## Why

Dynamic options and data lookup make forms feel connected to real systems, but they require loading, caching, invalidation, auth, fallback, stable submitted values, and privacy rules.

## What Changes

- Define adapter-backed option source contract.
- Define loading/error/empty states and submission safety.
- Define conditional option filtering and dependency tracking.

## Impact

- Future implementation touches adapters, renderer, builder inspector, cache behavior, and tests.

