import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');

export async function getDocContent(slugArray: string[]) {
  const relativePath = slugArray.join('/') + '.mdx';
  const filePath = path.join(DOCS_DIR, relativePath);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawContent = fs.readFileSync(filePath, 'utf-8');
  
  // Basic frontmatter extraction
  let title = '';
  let description = '';
  let content = rawContent;

  if (rawContent.startsWith('---')) {
    const endFrontmatter = rawContent.indexOf('---', 3);
    if (endFrontmatter !== -1) {
      const frontmatterText = rawContent.slice(3, endFrontmatter);
      const titleMatch = frontmatterText.match(/title:\s*(.*)/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/['"]/g, '').trim();
      }
      const descMatch = frontmatterText.match(/description:\s*(.*)/);
      if (descMatch && descMatch[1]) {
        description = descMatch[1].replace(/['"]/g, '').trim();
      }
      content = rawContent.slice(endFrontmatter + 3).trim();
    }
  }

  return {
    slug: slugArray.join('/'),
    content,
    frontmatter: {
      title,
      description
    }
  };
}

export function getAllDocsPaths(): string[][] {
  const walkSync = (dir: string, filelist: string[] = []): string[] => {
    if (!fs.existsSync(dir)) return [];
    fs.readdirSync(dir).forEach(file => {
      const dirFile = path.join(dir, file);
      try {
        filelist = walkSync(dirFile, filelist);
      } catch (err: any) {
        if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
      }
    });
    return filelist;
  };

  const files = walkSync(DOCS_DIR);
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const relative = path.relative(DOCS_DIR, file);
      return relative.replace(/\.mdx$/, '').split(path.sep);
    });
}
