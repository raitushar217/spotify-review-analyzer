// dev-api-server.mjs — Local dev server for Vercel-style API functions
// Run alongside `npm run dev` to serve /api/* routes on port 3001
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';

// Load .env variables (Vercel does this automatically in production)
try {
  const envFile = readFileSync('.env', 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      process.env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
} catch { /* no .env file */ }

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route /api/<name> to ./api/<name>.js
  const urlPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
  const match = urlPath.match(/^\/api\/([a-z-]+)$/);

  if (!match) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const handlerName = match[1];
  const handlerPath = path.resolve(`./api/${handlerName}.js`);

  try {
    // Parse JSON body for POST requests (Vercel does this automatically)
    if (req.method === 'POST' || req.method === 'PUT') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      try {
        req.body = JSON.parse(Buffer.concat(chunks).toString());
      } catch {
        req.body = {};
      }
    }

    const mod = await import(pathToFileURL(handlerPath).href + '?t=' + Date.now());
    const handler = mod.default;

    // Mock Vercel-style res
    const mockRes = {
      _statusCode: 200,
      _headers: {},
      setHeader(k, v) { this._headers[k] = v; return this; },
      status(code) { this._statusCode = code; return this; },
      json(body) {
        res.writeHead(this._statusCode, {
          'Content-Type': 'application/json',
          ...this._headers,
        });
        res.end(JSON.stringify(body));
      },
      end() { res.end(); },
    };

    await handler(req, mockRes);
  } catch (err) {
    console.error(`Error in /api/${handlerName}:`, err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`\n  API dev server running at http://localhost:${PORT}`);
  console.log(`  Try: http://localhost:${PORT}/api/appstore\n`);
});
