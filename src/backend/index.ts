import { serve } from 'bun';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import dbService from './db/db';
import { accountsRoutes } from './routes/accounts';
import { messagesRoutes } from './routes/messages';

const PORT = 3000;
const FRONTEND_BUILD_FOLDER = path.join(import.meta.dir, '../frontend/build');

const routes = { ...accountsRoutes, ...messagesRoutes };

dbService.migrate();

function matchRoute(
  method: string,
  path: string,
  routes: Record<string, (req: Request, params?: Record<string, string>) => Promise<Response>>
) {
  for (const routeKey of Object.keys(routes)) {
    const [routeMethod, routePath] = routeKey.split(':');
    if (method !== routeMethod) continue;
    const routeRegex = new RegExp(`^${routePath.replace(/\$([^/]+)/g, '(?<$1>[^/]+)')}$`);
    const match = routeRegex.exec(path);
    if (match) return routes[routeKey];
  }
}

serve({
  fetch(req) {
    const url = new URL(req.url);

    // serve API routes
    if (url.pathname.startsWith('/api')) {
      const route = matchRoute(req.method, url.pathname, routes);
      return route ? route(req) : new Response('Not Found', { status: 404 });
    }

    // serve frontend build
    try {
      let filePath =
        url.pathname === '/'
          ? path.join(FRONTEND_BUILD_FOLDER, 'index.html')
          : path.join(FRONTEND_BUILD_FOLDER, url.pathname);
      if (!existsSync(filePath)) {
        filePath = path.join(FRONTEND_BUILD_FOLDER, 'index.html');
      }
      const fileContent = readFileSync(filePath);

      // determine the correct Content-Type
      const ext = path.extname(filePath);
      const mimeType = { '.html': 'text/html', '.js' : 'application/javascript' }[ext] || 'application/octet-stream';

      return new Response(fileContent, { headers: { 'Content-Type': mimeType } });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
  port: PORT,
});

console.log(`Server running on http://localhost:${PORT}`);
