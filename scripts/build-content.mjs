import { mkdir, writeFile, readFile, readdir, unlink, rename } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileContent, loadContent } from './content/compiler.mjs';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export async function buildContent({ root = projectRoot, check = false } = {}) {
  const result = await compileContent(await loadContent(root));
  if (!check) {
    const generated = path.join(root, 'src/generated');
    const assets = path.join(root, 'public/learning-content');
    await mkdir(generated, { recursive: true });
    await mkdir(assets, { recursive: true });
    const writeChanged = async (file, value) => {
      const data = Buffer.isBuffer(value) ? value : Buffer.from(value);
      try { if ((await readFile(file)).equals(data)) return; } catch (error) { if (error.code !== 'ENOENT') throw error; }
      const temporary = `${file}.${randomUUID()}.tmp`;
      await writeFile(temporary, data);
      await rename(temporary, file);
    };
    for (const [name, value] of result.emitted) await writeChanged(path.join(assets, name), value);
    await writeChanged(path.join(generated, 'catalog.json'), `${JSON.stringify(result.catalog, null, 2)}\n`);
    // This directory is generated-only. Remove obsolete hashed outputs after a valid build.
    for (const name of await readdir(assets)) {
      if (/^(asset|lesson)-[a-f0-9]{16}\.[a-z]+$/.test(name) && !result.emitted.has(name)) await unlink(path.join(assets, name));
    }
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { catalog } = await buildContent({ check: process.argv.includes('--check') });
  console.log(`Content valid: ${catalog.questions.length} questions (${catalog.questions.filter(q => q.sourceFormat === 'markdown').length} Markdown), ${catalog.lessons.length} lessons.`);
}
