# Changelog

All notable changes to this project will be documented in this file.

## 0.1.0-alpha.1 - 2026-05-11

### Added
- Initial Angular Reactive Forms inspection MVP.
- Support for `FormControl`, `FormGroup`, and `FormArray`.
- Form registration through the `formLens` directive.
- Overlay-based inspection panel.
- Form tree visualization with path-based snapshots.
- Control details view with value, status, flags, and errors.
- Search by control name or path.
- Optional invalid control highlight in the host application UI.
- Demo app with multiple forms and nested structures.
- Initial test coverage for provider, registry, snapshot factory, and directive.
- Initial documentation with README and quick start guide.

### Changed
- Overlay behavior updated to remain persistent during form interaction.
- Panel scrolling improved for long technical content.
- Public API reduced to a smaller, more stable surface for early adopters.

### Known limitations
- Tree expand/collapse is not implemented yet.
- Highlight support for deeply nested dynamic structures can be improved.
- Highlight toggle is not available from inside the panel yet.
- Highlight styles are still centered on invalid state only.
- Validator introspection is still limited.
- Panel layout responsiveness still needs refinement.
- Current support is focused on Angular Reactive Forms only.

### Notes
- This is an alpha release intended for internal validation and early feedback.
- The main goal of this version is to validate usefulness and developer experience in real Angular projects.