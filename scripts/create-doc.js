const fs = require("fs");
const path = require("path");

const componentPath = path.resolve(process.argv[2]);

if (!fs.existsSync(componentPath)) {
  console.error(`File not found:\n${componentPath}`);
  process.exit(1);
}

const componentName = path.basename(componentPath, ".tsx");
const directory = path.dirname(componentPath);
const markdownPath = path.join(directory, `${componentName}.md`);

if (fs.existsSync(markdownPath)) {
  console.log(`${componentName}.md already exists.`);
  process.exit(0);
}

const template = `# Component: ${componentName}

## Purpose

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

-

## Features

-

## Dependencies

### Child Components

-

### External Libraries

-

### State Management

-

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|

If none:
No external props.

## Internal State

| Variable | Purpose |
|----------|----------|

## Main Event Handlers

-

## Component Flow

\`\`\`text
User
 ↓
...
\`\`\`

## Accessibility Notes

-

## Example Usage

\`\`\`tsx
<${componentName} />
\`\`\`

## Potential Improvements

-
`;

fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(markdownPath, template);

console.log(`Created: ${markdownPath}`);
