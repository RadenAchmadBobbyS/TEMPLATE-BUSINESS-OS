const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('actions.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Ensure import
  if (content.includes('requireActiveWorkspace(') && !content.includes('requireActiveWorkspaceAction')) {
    content = content.replace(/requireActiveWorkspace,/g, 'requireActiveWorkspace, requireActiveWorkspaceAction,');
    if (!content.includes('requireActiveWorkspaceAction')) {
      content = content.replace(/requireActiveWorkspace /g, 'requireActiveWorkspace, requireActiveWorkspaceAction ');
    }
    if (!content.includes('requireActiveWorkspaceAction')) {
      content = content.replace(/requireActiveWorkspace\s*\}/g, 'requireActiveWorkspace, requireActiveWorkspaceAction }');
    }
  }

  // Handle: const { workspace } = await requireActiveWorkspace();
  content = content.replace(
    /const\s*\{\s*workspace\s*\}\s*=\s*await requireActiveWorkspace\(\);/g,
    `const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace } = active;`
  );

  // Handle: const { workspace, role } = await requireActiveWorkspace();
  content = content.replace(
    /const\s*\{\s*workspace,\s*role\s*\}\s*=\s*await requireActiveWorkspace\(\);/g,
    `const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role } = active;`
  );

  // Handle: const { workspace, role: currentUserRole } = await requireActiveWorkspace();
  content = content.replace(
    /const\s*\{\s*workspace,\s*role\s*:\s*currentUserRole\s*\}\s*=\s*await requireActiveWorkspace\(\);/g,
    `const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role: currentUserRole } = active;`
  );

  // Handle: const { workspace, role, canCreateDelete } = await requireActiveWorkspace();
  content = content.replace(
    /const\s*\{\s*workspace,\s*role,\s*canCreateDelete\s*\}\s*=\s*await requireActiveWorkspace\(\);/g,
    `const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, canCreateDelete } = active;`
  );

  // Handle: const { workspace, role, ownerId } = await requireActiveWorkspace();
  content = content.replace(
    /const\s*\{\s*workspace,\s*role,\s*ownerId\s*\}\s*=\s*await requireActiveWorkspace\(\);/g,
    `const active = await requireActiveWorkspaceAction();
  if (!active.success) return { success: false, error: active.error };
  const { workspace, role, ownerId } = active;`
  );

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
