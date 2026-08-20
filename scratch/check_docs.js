const fs = require('fs');
const path = require('path');

const navFile = fs.readFileSync('src/core/docs/navigation.ts', 'utf8');
const regex = /href:\s*['"]\/docs\/([^'"]+)['"]/g;
let match;
const navHrefs = [];
while ((match = regex.exec(navFile)) !== null) {
  navHrefs.push(match[1]);
}

const DOCS_DIR = path.join(process.cwd(), 'docs');

const existingMdxFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const fPath = path.join(dir, file);
    if (fs.statSync(fPath).isDirectory()) walk(fPath);
    else if (file.endsWith('.mdx')) {
      existingMdxFiles.push(path.relative(DOCS_DIR, fPath).replace(/\\/g, '/').replace('.mdx', ''));
    }
  });
}
walk(DOCS_DIR);

const missingFiles = navHrefs.filter(href => !existingMdxFiles.includes(href));
console.log('--- MISSING DOCS FILES ---');
console.log(missingFiles);

const placeholderFiles = [];
existingMdxFiles.forEach(slug => {
  const fPath = path.join(DOCS_DIR, slug + '.mdx');
  const content = fs.readFileSync(fPath, 'utf8');
  if (
    content.includes('TODO') || 
    content.includes('Coming soon') || 
    content.includes('Lorem ipsum') || 
    content.includes('This page is a placeholder') ||
    content.length < 150
  ) {
    placeholderFiles.push(slug);
  }
});

console.log('--- PLACEHOLDER / SHORT FILES ---');
console.log(placeholderFiles);
