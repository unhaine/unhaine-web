import { readFile, writeFile, readdir, mkdir, rm, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { transform } from 'esbuild';
import { minify } from 'html-minifier-terser';

// Only generated output is cleared. Sources remain directly previewable.
const output = resolve('dist');
if (output !== join(process.cwd(), 'dist')) throw new Error('Unexpected output path');
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'assets'), { recursive: true });
const fingerprint = data => createHash('sha256').update(data).digest('hex').slice(0, 12);
const replacements = new Map();

async function emitAsset(source, contents) {
  const extension = source.slice(source.lastIndexOf('.'));
  const name = source.slice(source.lastIndexOf('/') + 1, -extension.length);
  const target = `assets/${name}.${fingerprint(contents)}${extension}`;
  await writeFile(join(output, target), contents);
  replacements.set(source, target);
  return target;
}

const unicode = JSON.parse(await readFile('assets/fonts/compact/unicode.json', 'utf8'));
let css = await readFile('styles.css', 'utf8');
const faces = [...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(match => match[0]);
for (const face of faces) {
  const source = face.match(/url\("([^"]+)"\)/)[1];
  const full = await emitAsset(source, await readFile(source));
  let replacement = face.replace(source, full);
  if (source.includes('SansKR-')) {
    const compactSource = source.replace('fonts/', 'fonts/compact/');
    const compact = await emitAsset(compactSource, await readFile(compactSource));
    replacement += face.replace(source, compact).replace(/\}$/, `unicode-range: ${unicode};\n}`);
    // Preload the small subset. The complete font remains available for other text.
    replacements.set(source, compact);
  }
  css = css.replace(face, replacement);
}
await emitAsset('styles.css', (await transform(css, { loader: 'css', minify: true })).code);
for (const source of ['background.js', 'script.js']) {
  const result = await transform(await readFile(source, 'utf8'), { loader: 'js', minify: true, charset: 'utf8' });
  await emitAsset(source, result.code);
}
for (const file of await readdir('assets/billain')) {
  if (!file.endsWith('.jpg')) continue;
  const source = `assets/billain/${file}`;
  await emitAsset(source, await readFile(source));
}
await emitAsset('assets/kata/kata-mark-v2.png', await readFile('assets/kata/kata-mark-v2.png'));
for (const file of await readdir('.')) {
  if (!file.endsWith('.html')) continue;
  let html = await readFile(file, 'utf8');
  for (const [source, target] of replacements) html = html.replaceAll(`"${source}"`, `"${target}"`);
  html = await minify(html, { collapseWhitespace: true, removeComments: true, removeRedundantAttributes: true });
  await writeFile(join(output, file), html);
}
await copyFile('assets/fonts/IBM-Plex-LICENSE.txt', join(output, 'assets/IBM-Plex-LICENSE.txt'));
await copyFile('assets/icons/Lucide-LICENSE.txt', join(output, 'assets/Lucide-LICENSE.txt'));
await writeFile(join(output, '_headers'), '/*\n  Cache-Control: public, max-age=60\n/assets/*\n  ! Cache-Control\n  Cache-Control: public, max-age=31536000, immutable\n');
console.log('Built static website in dist/');
