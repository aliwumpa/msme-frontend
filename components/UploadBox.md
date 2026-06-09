# Component: UploadBox

## Purpose

Upload and validate invoice/document submissions for MSME (Micro, Small, and Medium Enterprises) processing. Manages file selection, user identity (NIK), and reference number collection before submission.

<!--
Copilot Prompt:

Analyze the adjacent TypeScript React component and complete this document.

Rules:
- Infer business purpose.
- Explain important hooks and stores.
- List child components.
- Explain user interaction flow.
- Explain validation logic.
- Keep the existing structure.
- Output Markdown only.
-->

## Responsibilities

- Accept file uploads (PDF, PNG, JPG, JPEG) via drag-and-drop or file picker
- Validate required form fields (invoice type, NIK, reference number, file)
- Store file and metadata in application state
- Manage UI states for drag interactions and loading
- Prevent form submission until all fields are complete

## Features

- Drag-and-drop file upload with visual feedback
- Click-to-upload file selection via hidden input
- Real-time NIK validation (numeric only, max 16 digits)
- Reference number input field
- Invoice type selection via dropdown
- Form validation with disabled submit button until complete
- Loading state support

## Dependencies

### Child Components

- `DragArea` - Displays drag-drop target area and selected file name
- `Dropdown` - Renders invoice type selection dropdown

### External Libraries

- React hooks: `useRef`, `useState`
- Zustand store: imported from `@/store/useStore`

### State Management

- `useMSMEStore` - Zustand store managing:
  - `selectedFile` - Current file selection
  - `selectedOption` - Invoice type selection
  - `nik` - National ID number input
  - `referenceNumber` - Document reference number
  - `setSelectedFile()`, `setNik()`, `setReferenceNumber()` - Setter functions

## Props

No external props. Component is fully self-contained and derives state from the MSME store.

## Internal State

| Variable | Purpose |
|----------|----------|| `inputRef` | DOM reference to hidden file input element |
| `isLoading` | Boolean flag indicating whether file is being processed/uploaded |
| `isDragging` | Boolean flag for drag-over visual feedback state |
| `allowedContentTypes` | String constant defining accepted file types (.pdf,.png,.jpg,.jpeg) |
| `isInvoiceFormIncomplete` | Computed boolean: true if any required field is empty (selectedOption, nik, referenceNumber, or selectedFile) |
## Main Event Handlers

- `handleDragOver` - Prevents default behavior and sets `isDragging` to true for visual feedback
- `handleDragLeave` - Prevents default behavior and sets `isDragging` to false when leaving drag area
- `handleDrop` - Processes dropped files; prevents default behavior, validates loading state, calls `handleFileSelect()`
- `handleClick` - Triggers hidden file input click to open file picker dialog
- `handleFileSelect` - Extracts first file from FileList and stores it in MSME store via `setSelectedFile()`
- `preventDefaultBehavior` - Prevents default drag-and-drop browser behavior (file opening)
- `handleSubmit` - Currently a stub; intended to submit the complete invoice request form

### Input Handlers

- NIK input: Filters to numeric characters only via regex `/\D/g`, enforces max 16 characters
- Reference Number input: Accepts any text input without filtering

## Component Flow

```text
User visits component
         ↓
Sees form with three inputs:
  - Dropdown (invoice type)
  - NIK input (numeric, max 16 chars)
  - Reference Number input
         ↓
User interaction (choose one):
  A) Drags file over drop zone    B) Clicks to open file picker
      ↓                              ↓
  handleDragOver (sets isDragging)  handleClick opens file input
      ↓                              ↓
  handleDrop extracts file      Browser file dialog opens
      ↓                              ↓
  File validation & stored           User selects file
  in MSME store                      ↓
      ↓                          handleFileSelect stores file
      └────────────┬─────────────┘
                   ↓
  isInvoiceFormIncomplete recalculated
  (checks if all 4 fields filled)
                   ↓
  Submit button enabled if form complete
                   ↓
  User clicks Submit
                   ↓
  handleSubmit() triggered
  [Currently unimplemented]
```

## Accessibility Notes

- All input fields have `<label>` elements with `htmlFor` attributes linking to corresponding input `id`s
- Dropdown uses shared `.dropdown__label` styling
- NIK input has max length constraint (16 characters) for user guidance
- Submit button is disabled when form is incomplete, preventing invalid submissions
- Form inputs are semantic HTML elements (input type="text", input type="file")
- Drag-and-drop area has click handler as fallback for users unable to drag

## Example Usage

```tsx
<UploadBox />
```

## Potential Improvements

- **Implement handleSubmit()** - Currently a stub; needs actual submission logic (API call, validation, error handling)
- **File size validation** - No check for maximum file size; users could select very large files
- **File type validation feedback** - No user-facing validation message if wrong file type is selected
- **Post-upload feedback** - No success/error message displayed to user after selection
- **Loading state usage** - `isLoading` state is set but never modified; consider implementing async file processing
- **Error handling** - No try-catch or error boundary for file operations
- **Visual feedback** - `isDragging` state could provide more visible UI changes to indicate drop zone is active
- **Accessibility enhancements** - Consider adding aria-labels, aria-invalid, and error messages for screen readers
