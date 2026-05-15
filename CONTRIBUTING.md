# Contributing to FormLens

Thanks for your interest in contributing to FormLens.

FormLens is currently in early alpha and focused on validating the MVP for Angular Reactive Forms inspection.

## Current focus

Right now, the project is prioritizing:
- real-world feedback from Angular developers
- issues found in practical usage
- improvements to core inspection workflows
- API stability before broader adoption

## Good ways to contribute

The most helpful contributions right now are:
- bug reports with reproduction steps
- feedback on developer experience
- suggestions based on real Angular forms usage
- improvements to docs and setup clarity
- targeted fixes in the MVP scope

## Before opening a PR

Please:
1. Check existing issues first.
2. Keep the scope focused.
3. Avoid bundling unrelated changes in one PR.
4. Prefer improvements that support the current MVP direction.

## What is in scope

Contributions are welcome for:
- Reactive Forms inspection improvements
- demo app improvements
- docs fixes
- test coverage for current features
- performance or stability fixes

## What is not a priority right now

These areas are not the current focus:
- template-driven forms
- enterprise integrations
- analytics or telemetry
- remote tooling
- major API expansion without validation
- large visual redesigns disconnected from MVP needs

## Development flow

Suggested flow:
1. Fork the repository.
2. Create a branch from `main`.
3. Make a focused change.
4. Run build and tests.
5. Open a pull request with context and screenshots when relevant.

## Pull request notes

A good PR should include:
- a clear problem statement
- what changed
- why the change is useful
- screenshots or demo notes for UI changes
- any known limitations

## Reporting issues

When opening an issue, include:
- Angular version
- how the form is structured
- expected behavior
- actual behavior
- reproduction steps
- screenshots if the issue is visual

## Code expectations

Please aim for:
- small, readable changes
- consistency with the current codebase
- minimal public API growth
- no unnecessary abstractions
- tests for meaningful core behavior changes

## Feedback

At this stage, product feedback is as valuable as code contributions.

If FormLens helped or failed in a real Angular form debugging scenario, that feedback is especially useful.

## Troubleshooting

**Changes to the lib not reflected after reinstall?**
Run `rm -rf .angular/cache` in the consumer project before `ng serve`.