# Roadmap

This roadmap reflects the current direction for FormLens after the first MVP alpha.

The goal is to improve usefulness for Angular Reactive Forms debugging before expanding scope.

## Current stage

Current release line:
- `0.1.0-alpha.x`

Current focus:
- validate core usefulness
- improve reliability
- tighten API boundaries
- collect feedback from real Angular projects

## Near term

These are the most likely next improvements:

### Inspection UX
- tree expand and collapse
- better navigation in large form structures
- improved scanning of control details
- stronger validator visibility

### Highlighting
- better support for deeply nested dynamic controls
- optional toggle from inside the panel
- richer state visuals beyond invalid only
- alternate highlight modes

### Stability
- broader test coverage
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