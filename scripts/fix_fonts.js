const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Simplest string replacements
      // 1. standalone style
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]'Space Grotesk',\s*sans-serif['"]\s*\}\}/g, 'className="font-display"');
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"]\s*\}\}/g, 'className="font-data"');
      
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]"Space Grotesk",\s*sans-serif['"]\s*\}\}/g, 'className="font-display"');
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]"IBM Plex Mono",\s*monospace['"]\s*\}\}/g, 'className="font-data"');

      // 2. merged with color (color first)
      content = content.replace(/style=\{\{\s*color:\s*(['"][^'"]+['"]|var\([^)]+\)),\s*fontFamily:\s*['"]'Space Grotesk',\s*sans-serif['"]\s*\}\}/g, 'className="font-display" style={{ color: $1 }}');
      content = content.replace(/style=\{\{\s*color:\s*(['"][^'"]+['"]|var\([^)]+\)),\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"]\s*\}\}/g, 'className="font-data" style={{ color: $1 }}');
      
      // 3. merged with color (font first)
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]'Space Grotesk',\s*sans-serif['"],\s*color:\s*(['"][^'"]+['"]|var\([^)]+\))\s*\}\}/g, 'className="font-display" style={{ color: $1 }}');
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"],\s*color:\s*(['"][^'"]+['"]|var\([^)]+\))\s*\}\}/g, 'className="font-data" style={{ color: $1 }}');

      // 4. fontSize + fontFamily (app page.tsx)
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"],\s*fontSize:\s*(['"][^'"]+['"])\s*\}\}/g, 'className="font-data" style={{ fontSize: $1 }}');

      // 5. borderColor + fontFamily + fontSize + color
      content = content.replace(/style=\{\{\s*borderColor:\s*(['"][^'"]+['"]),\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"],\s*fontSize:\s*(['"][^'"]+['"]),\s*color:\s*(['"][^'"]+['"])\s*\}\}/g, 'className="font-data" style={{ borderColor: $1, fontSize: $2, color: $3 }}');

      // 6. borderColor + fontFamily + color
      content = content.replace(/style=\{\{\s*borderColor:\s*(['"][^'"]+['"]),\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"],\s*color:\s*(['"][^'"]+['"])\s*\}\}/g, 'className="font-data" style={{ borderColor: $1, color: $2 }}');

      // Let's also do a generic fallback: replace just the fontFamily property but keep style tag.
      // This is safer if we missed combinations.
      content = content.replace(/style=\{\{\s*(.*?)\s*,\s*fontFamily:\s*['"]'Space Grotesk',\s*sans-serif['"]\s*\}\}/g, 'className="font-display" style={{ $1 }}');
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]'Space Grotesk',\s*sans-serif['"]\s*,\s*(.*?)\s*\}\}/g, 'className="font-display" style={{ $1 }}');
      content = content.replace(/style=\{\{\s*(.*?)\s*,\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"]\s*\}\}/g, 'className="font-data" style={{ $1 }}');
      content = content.replace(/style=\{\{\s*fontFamily:\s*['"]'IBM Plex Mono',\s*monospace['"]\s*,\s*(.*?)\s*\}\}/g, 'className="font-data" style={{ $1 }}');

      // Then merge className="X" className="Y" to className="X Y"
      content = content.replace(/className=(['"])(.*?)\1\s+className=(['"])(.*?)\3/g, 'className="$2 $4"');
      content = content.replace(/className=(['"])(.*?)\1\s+className=(['"])(.*?)\3/g, 'className="$2 $4"');
      content = content.replace(/className=(['"])(.*?)\1\s+className=(['"])(.*?)\3/g, 'className="$2 $4"');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, '../src'));
