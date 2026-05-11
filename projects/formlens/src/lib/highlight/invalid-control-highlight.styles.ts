export const FORMLENS_INVALID_CONTROL_CLASS = 'formlens-invalid-control-highlight';
export const FORMLENS_INVALID_CONTROL_DATASET = 'data-formlens-invalid';

export const FORMLENS_HIGHLIGHT_GLOBAL_STYLES = `
  .formlens-invalid-control-highlight {
    outline: 2px solid #dc2626 !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12) !important;
    transition: outline-color 120ms ease, box-shadow 120ms ease !important;
  }
`;