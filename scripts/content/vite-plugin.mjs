import path from 'node:path';
import { buildContent, projectRoot } from '../build-content.mjs';
import { compileContent, loadContent } from './compiler.mjs';

const virtualId = '\0learning-content';
export const draftPreviewEnabled = config => config.command === 'serve' && !config.isPreview && config.mode === 'drafts';

export function learningContent() {
  let result;
  let drafts = false;
  const rebuild = async () => {
    result = drafts ? await compileContent({ ...await loadContent(projectRoot), includeDrafts: true }) : await buildContent();
  };
  return {
    name: 'learning-content',
    async configResolved(config) {
      drafts = draftPreviewEnabled(config);
      if (drafts && !['127.0.0.1', 'localhost', '::1'].includes(config.server.host)) {
        throw new Error('Draft preview must bind to a loopback host. Use npm run dev:drafts.');
      }
      await rebuild();
    },
    resolveId(id) { if (id === 'virtual:learning-content') return virtualId; },
    load(id) { if (id === virtualId) return `export default ${JSON.stringify(result.catalog)};`; },
    configureServer(server) {
      if (drafts) server.middlewares.use((request, response, next) => {
        const url = (request.url || '').split('?')[0];
        if (!url.startsWith('/__draft-content/')) return next();
        const name = url.slice('/__draft-content/'.length);
        if (!['GET', 'HEAD'].includes(request.method) || !result.emitted.has(name)) {
          response.statusCode = 404; response.end(); return;
        }
        const types = { '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
        response.setHeader('Content-Type', types[path.extname(name)] || 'application/octet-stream');
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.end(request.method === 'HEAD' ? undefined : result.emitted.get(name));
      });
      const directories = ['content', 'src/data'].map(name => path.join(projectRoot, name));
      server.watcher.add(directories);
      let timer;
      let pending = false;
      let running = false;
      const update = async () => {
        if (running) { pending = true; return; }
        running = true;
        try {
          do { pending = false; await rebuild(); } while (pending);
          const module = server.moduleGraph.getModuleById(virtualId);
          if (module) server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: 'full-reload' });
        } catch (error) {
          server.config.logger.error(error.message);
          server.ws.send({ type: 'error', err: { message: error.message, stack: error.stack } });
        } finally { running = false; }
      };
      const onChange = (_event, file) => {
        if (directories.some(dir => file.startsWith(`${dir}${path.sep}`))) {
          clearTimeout(timer); timer = setTimeout(update, 80);
        }
      };
      server.watcher.on('all', onChange);
      server.httpServer?.once('close', () => { clearTimeout(timer); server.watcher.off('all', onChange); });
    },
  };
}
