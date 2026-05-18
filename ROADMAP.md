# Roadmap

This roadmap reflects the current direction for FormLens after the first MVP alpha releases.

The goal is to improve usefulness for Angular Reactive Forms debugging before expanding scope.

## Current stage

Current release line:
- `0.1.0-alpha.x`

Current focus:
- validate core usefulness
- improve reliability
- tighten API boundaries
- collect feedback from real Angular projects

## Delivered in 0.1.0-alpha.2

These items were planned and are now implemented:

- tree expand and collapse per node
- validator names visible per control in the panel
- floating action button (FAB) auto-injected — no manual setup required
- Angular 17+ compatibility (`peerDependencies` updated, `APP_INITIALIZER` used instead of `provideAppInitializer`)
- highlight rewritten to correctly target nested groups and FormArrays
- FAB icon sync fixed when overlay is disposed externally (navigation)
- demo app expanded with Checkout, Registration, and Survey forms
- 59 unit tests covering core snapshot, tree, details, and store flows

## Near term

These are the most likely next improvements:

### Inspection UX
- better navigation in large form structures
- improved scanning of control details
- stronger validator visibility and readable explanations

### Highlighting
- better support for deeply nested dynamic controls
- optional toggle from inside the panel
- richer state visuals beyond invalid only (pending, disabled)
- alternate highlight modes (badge instead of outline)

### Stability
- broader integration test coverage
- cleanup of internal APIs
- more predictable public API boundaries
- release hardening for early adopters

### Documentation
- richer examples
- troubleshooting improvements
- installation clarity
- contribution guidance based on early feedback

## Later possibilities

These may be explored after the core MVP is validated:
- template-driven forms support
- Signal Forms support
- persisted panel preferences
- filters by control state
- snapshot export
- improved keyboard shortcuts

## Explicitly not current focus

These are not part of the current roadmap priority:
- browser extension
- remote inspection
- telemetry
- paid features
- enterprise-only integrations
- form builder features

## How this roadmap is used

This roadmap is directional, not a fixed promise.

Priorities may change based on:
- real usage feedback
- recurring bug reports
- DX pain points
- complexity discovered in production-like forms
