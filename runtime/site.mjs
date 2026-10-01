import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { projectDirectory, readConfiguration, publicConfiguration } from './config.mjs';
import { enforceLocalRequest, readJson, json } from './http.mjs';
const configuration = await readConfiguration();
const websitePort = Number(process.env.ACCORD_WEB_PORT || 4317);
let demoProcess = null;
const publicFiles = new Map([
  ['/', ['web/index.html','text/html; charset=utf-8']], ['/index.html',['web/index.html','text/html; charset=utf-8']],
  ['/styles.css',['web/styles.css','text/css; charset=utf-8']], ['/style.css',['web/style.css','text/css; charset=utf-8']], ['/app.js',['web/app.js','text/javascript; charset=utf-8']],
  ['/decisions.html',['web/decisions.html','text/html; charset=utf-8']], ['/decisions.js',['web/decisions.js','text/javascript; charset=utf-8']], ['/protocol.html',['web/protocol.html','text/html; charset=utf-8']],
  ['/README.md',['README.md','text/plain; charset=utf-8']], ['/PROTOCOL.md',['PROTOCOL.md','text/plain; charset=utf-8']], ['/SECURITY.md',['SECURITY.md','text/plain; charset=utf-8']],
  ['/docs/protocol.md',['docs/protocol.md','text/plain; charset=utf-8']], ['/docs/architecture.md',['docs/architecture.md','text/plain; charset=utf-8']], ['/docs/security.md',['docs/security.md','text/plain; charset=utf-8']]
]);
const websiteServer = http.createServer(async(request,response)=>{
  try {
    enforceLocalRequest(request,websitePort);
    const requestPath = new URL(request.url,`http://127.0.0.1:${websitePort}`).pathname;
    if (request.method === 'GET' && requestPath === '/api/health') return json(response,200,{ok:true,...publicConfiguration(configuration),network:'Local development chain',currency:'Test ETH'});
    if (request.method === 'GET' && requestPath === '/api/logs') {
      const ledger = await readFile(path.join(projectDirectory,'logs/ledger.jsonl'),'utf8');
      const sources = JSON.parse(await readFile(path.join(projectDirectory,'logs/sources.json'),'utf8'));
      return json(response,200,{records:ledger.trim().split('\n').filter(Boolean).map(line=>JSON.parse(line)),sources});
    }
    if (request.method === 'POST' && requestPath === '/api/demo') {
      if (demoProcess) return json(response,409,{error:'Another demonstration is running. Try again when it finishes.'});
      const payload = await readJson(request);
      if (demoProcess) return json(response,409,{error:'Another demonstration is running.'});
      if (payload.scenario && !['success','replay','budget'].includes(payload.scenario)) return json(response,400,{error:'Unknown demonstration scenario'});
      demoProcess = spawn(process.execPath,[path.join(projectDirectory,'runtime/buyer.mjs'),JSON.stringify({scenario:payload.scenario,values:payload.values})],{cwd:projectDirectory,env:process.env,stdio:['ignore','pipe','pipe']});
      const buyerProcess=demoProcess;
      let publicOutput='';
      buyerProcess.stdout.on('data',chunk=>{publicOutput+=chunk;if(publicOutput.length>65536) buyerProcess.kill('SIGTERM');});
      // Child diagnostics are intentionally not forwarded: the public API exposes sanitized results only.
      buyerProcess.stderr.resume();
      const demonstrationTimeout=setTimeout(()=>buyerProcess.kill('SIGTERM'),45000);
      buyerProcess.on('error',()=>{clearTimeout(demonstrationTimeout);demoProcess=null;json(response,500,{error:'Could not start buyer process'});});
      buyerProcess.on('close',exitCode=>{
        clearTimeout(demonstrationTimeout);demoProcess=null;
        if(response.writableEnded) return;
        if(exitCode!==0) return json(response,400,{error:'Demonstration could not complete. Check the local services and supplied values.'});
        try { json(response,200,JSON.parse(publicOutput.trim())); } catch { json(response,500,{error:'Buyer returned an invalid result'}); }
      });
      return;
    }
    if(request.method !== 'GET' || !publicFiles.has(requestPath)) return json(response,404,{error:'Not found'});
    const [relativeFile,contentType]=publicFiles.get(requestPath);
    const content=await readFile(path.join(projectDirectory,relativeFile));
    response.writeHead(200,{'Content-Type':contentType,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});response.end(content);
  } catch(error) { json(response,error.code==='ENOENT'?404:400,{error:error.code==='ENOENT'?'Not found':error.message}); }
});
websiteServer.requestTimeout=15000;
websiteServer.listen(websitePort,'127.0.0.1',()=>console.log(`Website listening on http://127.0.0.1:${websitePort}`));
for(const signal of ['SIGTERM','SIGINT']) process.on(signal,()=>{demoProcess?.kill('SIGTERM');websiteServer.close(()=>process.exit(0));});
