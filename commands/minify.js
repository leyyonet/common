import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import JavaScriptObfuscator from 'javascript-obfuscator';

const DIST_DIR = path.resolve('./dist');

const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: true,
  stringArray: true,
  rotateStringArray: true,
  renameGlobals: false,
  identifierNamesGenerator: 'none',
};

async function processFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');

  const minified = await minify(code, {
    compress: true,
    mangle: false, // save names
    module: true,
    sourceMap: true
  });

  const obfuscated = JavaScriptObfuscator.obfuscate(minified.code, obfuscatorOptions);

  fs.writeFileSync(filePath, obfuscated.getObfuscatedCode());
  console.log(`Processed (overwrite): ${filePath}`);
}

async function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkDir(fullPath);
    else if (entry.isFile() && fullPath.endsWith('.js')) {
      await processFile(fullPath);
    }
  }
}

// Top-level await (ESM)
await walkDir(DIST_DIR);
