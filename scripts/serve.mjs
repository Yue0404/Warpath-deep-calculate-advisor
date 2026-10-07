import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const portArg = process.argv.find((item) => item.startsWith('--port='));
const baseArg = process.argv.find((item) => item.startsWith('--base='));
const port = Number(portArg?.slice('--port='.length) ?? process.env.PORT ?? 4173);
let basePath = baseArg?.slice('--base='.length) ?? '/';
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('端口必须是 0 到 65535 的整数');
if (!basePath.startsWith('/')) basePath = `/${basePath}`;
if (!basePath.endsWith('/')) basePath += '/';

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
]);

const server = createServer(async (request, response) => {
  let requestPath;
  try {
    requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('非法路径');
    return;
  }
  if (!requestPath.startsWith(basePath)) {
    response.writeHead(404).end('未找到');
    return;
  }
  const relativePath = requestPath.slice(basePath.length) || 'index.html';
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end('禁止访问');
    return;
  }
  try {
    if (!(await stat(filePath)).isFile()) throw new Error('不是文件');
    response.writeHead(200, { 'content-type': contentTypes.get(path.extname(filePath)) ?? 'application/octet-stream' });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end('未找到');
  }
});

server.listen(port, () => {
  const address = server.address();
  console.log(`本地预览：http://localhost:${address.port}${basePath}`);
});
