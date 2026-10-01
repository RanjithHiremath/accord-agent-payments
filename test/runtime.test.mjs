import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, stat, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { once } from 'node:events';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import { compileContract, payOffer } from '../lib/protocol.mjs';
import { projectDirectory } from '../runtime/config.mjs';
async function freePort(){const listener=net.createServer();listener.listen(0,'127.0.0.1');await once(listener,'listening');const port=listener.address().port;await new Promise(resolve=>listener.close(resolve));return port;}
async function waitUntilReady(url,launcher){
  for(let attempt=0;attempt<200;attempt++){
    if(launcher.exitCode!==null)throw new Error('Launcher exited before readiness');
    try{if((await fetch(url)).ok)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error('Local runtime readiness timed out');
}
async function postJson(url,payload,headers={}){return fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(payload)});}
test('separate agents exchange, enforce budgets, reject tampering and safely recover delivery',{timeout:120000},async()=>{
  const stateDirectory=await mkdtemp(path.join(tmpdir(),'accord-runtime-test-'));
  const chainPort=await freePort();const sellerPort=await freePort();const websitePort=await freePort();
  const websiteUrl=`http://127.0.0.1:${websitePort}`;const sellerUrl=`http://127.0.0.1:${sellerPort}`;
  const launcher=spawn(process.execPath,['runtime/start.mjs'],{cwd:projectDirectory,env:{...process.env,ACCORD_STATE_DIR:stateDirectory,ACCORD_CHAIN_PORT:String(chainPort),ACCORD_SELLER_PORT:String(sellerPort),ACCORD_WEB_PORT:String(websitePort)},stdio:['ignore','pipe','pipe']});
  let diagnostics='';launcher.stdout.on('data',chunk=>diagnostics+=chunk);launcher.stderr.on('data',chunk=>diagnostics+=chunk);
  let provider;
  try{
    await waitUntilReady(`${websiteUrl}/api/health`,launcher).catch(error=>{throw new Error(`${error.message}\n${diagnostics}`);});
    assert.equal((await stat(path.join(stateDirectory,'wallets.json'))).mode&0o777,0o600);
    const configuration=JSON.parse(await readFile(path.join(stateDirectory,'network.json'),'utf8'));
    const privateWallets=JSON.parse(await readFile(path.join(stateDirectory,'wallets.json'),'utf8'));
    const health=await(await fetch(`${websiteUrl}/api/health`)).text();
    assert.ok(!health.includes(privateWallets.buyerPrivateKey));
    for(const forbiddenPath of ['/.local/wallets.json','/runtime/config.mjs','/package.json','/logs/ledger.jsonl'])assert.equal((await fetch(`${websiteUrl}${forbiddenPath}`)).status,404);
    assert.equal((await postJson(`${websiteUrl}/api/demo`,{}, {Origin:'https://attacker.example'})).status,400);
    assert.equal((await postJson(`${websiteUrl}/api/demo`,{}, {Host:'attacker.example'})).status,400);
    assert.equal((await postJson(`${websiteUrl}/api/demo`,{values:[]})).status,400);
    const overlappingDemo=postJson(`${websiteUrl}/api/demo`,{scenario:'success'});
    await new Promise(resolve=>setTimeout(resolve,100));
    assert.equal((await postJson(`${websiteUrl}/api/demo`,{scenario:'success'})).status,409);
    assert.equal((await overlappingDemo).status,200);
    const success=await(await postJson(`${websiteUrl}/api/demo`,{scenario:'success'})).json();
    assert.equal(success.ok,true);assert.deepEqual(success.result,{count:5,sum:120,min:12,max:36});assert.match(success.transactionHash,/^0x[0-9a-f]{64}$/i);
    const replay=await(await postJson(`${websiteUrl}/api/demo`,{scenario:'replay'})).json();assert.equal(replay.ok,true);assert.equal(replay.reused,true);
    provider=new JsonRpcProvider(configuration.rpcUrl);
    const nonceBefore=await provider.send('eth_getTransactionCount',[configuration.buyerAddress,'latest']);
    const budget=await(await postJson(`${websiteUrl}/api/demo`,{scenario:'budget'})).json();assert.equal(budget.ok,true);assert.equal(budget.transactionHash,undefined);
    assert.equal(await provider.send('eth_getTransactionCount',[configuration.buyerAddress,'latest']),nonceBefore);
    const values=[3,7,11];
    const offer=await(await postJson(`${sellerUrl}/quote`,{buyer:configuration.buyerAddress,values})).json();
    assert.equal((await postJson(`${sellerUrl}/deliver`,{offer})).status,402);
    const paymentOptions={wallet:new Wallet(privateWallets.buyerPrivateKey,provider),provider,expected:{buyer:configuration.buyerAddress,seller:configuration.sellerAddress,chainId:configuration.chainId,contractAddress:configuration.contractAddress,values,maxPaymentWei:'100000000000000',nowSeconds:String(Math.floor(Date.now()/1000))},maxGasWei:'1000000000000000',maxTotalWei:'1100000000000000'};
    const payment=await payOffer(offer,paymentOptions);
    // Delivery was deliberately not requested until after payment; repeat recovery uses chain state.
    const delivered=await(await postJson(`${sellerUrl}/deliver`,{offer})).json();assert.deepEqual(delivered.result,{count:3,sum:21,min:3,max:11});
    assert.deepEqual(await(await postJson(`${sellerUrl}/deliver`,{offer})).json(),delivered);
    const restartedState=await mkdtemp(path.join(tmpdir(),'accord-restarted-seller-'));
    const restartedPort=await freePort();const restartedUrl=`http://127.0.0.1:${restartedPort}`;
    await writeFile(path.join(restartedState,'network.json'),JSON.stringify({...configuration,sellerUrl:restartedUrl}));
    await writeFile(path.join(restartedState,'wallets.json'),JSON.stringify(privateWallets),{mode:0o600});
    const restartedSeller=spawn(process.execPath,['runtime/seller.mjs'],{cwd:projectDirectory,env:{...process.env,ACCORD_STATE_DIR:restartedState},stdio:'ignore'});
    try {
      await waitUntilReady(`${restartedUrl}/health`,restartedSeller);
      assert.deepEqual(await(await postJson(`${restartedUrl}/deliver`,{offer})).json(),delivered);
    }finally {restartedSeller.kill('SIGTERM');if(restartedSeller.exitCode===null)await once(restartedSeller,'exit');await rm(restartedState,{recursive:true,force:true});}

    const changedOffer=structuredClone(offer);changedOffer.request.values=[2,4];assert.equal((await postJson(`${sellerUrl}/deliver`,{offer:changedOffer})).status,400);
    const changedBuyer=structuredClone(offer);changedBuyer.quote.buyer=Wallet.createRandom().address;assert.equal((await postJson(`${sellerUrl}/deliver`,{offer:changedBuyer})).status,400);
    const contract=new Contract(configuration.contractAddress,compileContract().abi,provider);assert.equal((await contract.queryFilter(contract.filters.Paid(payment.quoteId))).length,1);
    // Advance chain time beyond the signed expiry: already-paid delivery and receipt recovery still work.
    await provider.send('evm_increaseTime',[180]);await provider.send('evm_mine',[]);
    assert.equal((await postJson(`${sellerUrl}/deliver`,{offer})).status,200);
    assert.equal((await payOffer(offer,paymentOptions)).reused,true);
  }finally{
    provider?.destroy();launcher.kill('SIGTERM');if(launcher.exitCode===null)await once(launcher,'exit');await rm(stateDirectory,{recursive:true,force:true});
  }
});
