import fs from 'fs';
import path from 'path';
import { docsNavigation } from '../src/core/docs/navigation';

const docsDir = path.join(process.cwd(), 'docs');

// Create base directory if it doesn't exist
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

let createdCount = 0;

docsNavigation.forEach((section) => {
  section.items.forEach((item) => {
    // Determine file path from href (e.g. /docs/getting-started/quickstart -> docs/getting-started/quickstart.mdx)
    const relativePath = item.href.replace('/docs/', '') + '.mdx';
    const filePath = path.join(docsDir, relativePath);
    const dirName = path.dirname(filePath);

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      const content = `---
title: "${item.title}"
description: "Documentation for ${item.title}."
section: "${section.title}"
---

# ${item.title}

<Callout type="info">
This documentation page describes the **${item.title}** functionality in Business OS.
</Callout>

## Overview

Welcome to the documentation for ${item.title}. This section covers the core concepts, usage, and configuration.

### What you'll learn

- How ${item.title.toLowerCase()} works in Business OS
- Step-by-step usage
- Configuration options

## Main Concept

Business OS provides robust support for ${item.title.toLowerCase()}. Below are the details on how it integrates into the platform.

\`\`\`typescript
// Example configuration for ${item.title.replace(/\s+/g, '')}
const config = {
  enabled: true,
  feature: "${item.title}"
};
\`\`\`

## Common Problems

If you encounter issues, please verify your environment configuration and check the [Support](/docs/support/center) documentation.

<CardGrid>
  <Card title="Related Topic" href="#">
    Explore related documentation.
  </Card>
  <Card title="API Reference" href="/docs/developer/overview">
    View the developer API.
  </Card>
</CardGrid>
`;
      fs.writeFileSync(filePath, content, 'utf8');
      createdCount++;
    }
  });
});

console.log(`Created ${createdCount} MDX files successfully.`);
