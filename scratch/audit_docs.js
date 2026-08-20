const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(process.cwd(), 'docs');

function getMdxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allFiles = getMdxFiles(DOCS_DIR);

let totalArticles = allFiles.length;
let thinContent = [];
let potentialIssues = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relativePath = path.relative(DOCS_DIR, file).replace(/\\/g, '/');
  
  // Basic frontmatter extraction
  let bodyContent = content;
  if (content.startsWith('---')) {
    const endFrontmatter = content.indexOf('---', 3);
    if (endFrontmatter !== -1) {
      bodyContent = content.slice(endFrontmatter + 3).trim();
    }
  }

  const wordCount = bodyContent.split(/\s+/).length;
  
  // Thin content check
  if (wordCount < 150) {
    thinContent.push({ file: relativePath, words: wordCount, issue: 'Very short content, likely lacks step-by-step guides.' });
  } else if (!bodyContent.includes('### ') && !bodyContent.includes('## ')) {
    thinContent.push({ file: relativePath, words: wordCount, issue: 'No structural headings. Might just be a generic paragraph.' });
  }

  // Cross links check
  const hasLinks = /\[.*?\]\(.*?\)/.test(bodyContent);
  if (!hasLinks) {
    potentialIssues.push({ file: relativePath, issue: 'MISSING CROSS LINKS: No markdown links found in this article.' });
  }

  // Feature specific checks
  if (relativePath.includes('builder/')) {
    if (!bodyContent.includes('nodeTree') && !bodyContent.includes('PageVersion') && !bodyContent.includes('Component')) {
      potentialIssues.push({ file: relativePath, issue: 'MISSING ARCHITECTURE DETAILS: Builder docs should mention nodeTree, PageVersion, etc.' });
    }
  }

  if (relativePath.includes('billing/')) {
    if (!bodyContent.includes('Stripe') && !bodyContent.includes('SubscriptionTier') && !bodyContent.includes('PLAN_LIMITS')) {
      potentialIssues.push({ file: relativePath, issue: 'WRONG TERMINOLOGY/MISSING: Billing should mention SubscriptionTier, Stripe, or PLAN_LIMITS.' });
    }
    if (bodyContent.includes('Midtrans') || bodyContent.includes('Xendit')) {
      potentialIssues.push({ file: relativePath, issue: 'INACCURATE CONTENT: Midtrans/Xendit might be mentioned as fully operational but are scaffolds.' });
    }
  }

  if (relativePath.includes('domains/')) {
    if (!bodyContent.includes('proxy') && !bodyContent.includes('Vercel API')) {
      potentialIssues.push({ file: relativePath, issue: 'MISSING FLOW: Domains should mention proxy routing and Vercel API.' });
    }
  }

  if (relativePath.includes('analytics/')) {
    if (!bodyContent.includes('AnalyticsVisitor') && !bodyContent.includes('AnalyticsSession') && !bodyContent.includes('collect')) {
      potentialIssues.push({ file: relativePath, issue: 'MISSING DB/API: Analytics should mention AnalyticsVisitor, AnalyticsSession, or /api/analytics/collect.' });
    }
    if (bodyContent.includes('Redis') || bodyContent.includes('ClickHouse')) {
      potentialIssues.push({ file: relativePath, issue: 'WRONG TERMINOLOGY: Mentions Redis/ClickHouse which might not be used.' });
    }
  }
});

const report = [
  `# Documentation Quality Audit Report\n`,
  `- **Total Articles:** ${totalArticles}`,
  `- **Thin Content Articles:** ${thinContent.length}`,
  `- **Articles with Potential Issues (Links/Terminology/Accuracy):** ${potentialIssues.length}\n`,
  `## Thin Content`,
  ...thinContent.map(t => `- **${t.file}** (${t.words} words): ${t.issue}`),
  `\n## Potential Issues (Missing Links, Inaccurate Content)`,
  ...potentialIssues.map(p => `- **${p.file}**: ${p.issue}`)
].join('\n');

fs.writeFileSync('scratch/audit_report.md', report);
console.log('Audit complete. Check scratch/audit_report.md');
