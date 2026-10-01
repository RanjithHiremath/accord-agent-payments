export function json(response, status, payload) {
  response.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  response.end(JSON.stringify(payload));
}
export function enforceLocalRequest(request, port) {
  const allowedHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
  if (!allowedHosts.includes(request.headers.host)) throw new Error('Unrecognized local host');
  if (request.headers.origin && !allowedHosts.map(host => `http://${host}`).includes(request.headers.origin)) throw new Error('Cross-origin requests are not allowed');
  if (request.headers['sec-fetch-site'] === 'cross-site') throw new Error('Cross-site requests are not allowed');
}
export async function readJson(request) {
  if (!(request.headers['content-type'] || '').startsWith('application/json')) throw new Error('Expected application/json');
  let content = '';
  for await (const chunk of request) { content += chunk; if (Buffer.byteLength(content) > 16384) throw new Error('Request exceeds 16 KiB'); }
  const parsed = JSON.parse(content || '{}');
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Expected a JSON object');
  return parsed;
}
export async function requestJson(url, body) {
  const response = await fetch(url, {method: body ? 'POST':'GET', headers: body ? {'Content-Type':'application/json'}:{}, body: body ? JSON.stringify(body):undefined, signal:AbortSignal.timeout(15000)});
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Request failed: ${response.status}`);
  return payload;
}
