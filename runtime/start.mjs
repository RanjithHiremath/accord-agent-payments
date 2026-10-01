import { startDevelopmentChain } from './development-chain.mjs';
import { ContractFactory, JsonRpcProvider, Wallet, parseEther } from 'ethers';
import { mkdir, writeFile, chmod, open, unlink } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { compileContract } from '../lib/protocol.mjs';
import { stateDirectory, projectDirectory } from './config.mjs';
const chainPort=Number(process.env.ACCORD_CHAIN_PORT||8545);
const sellerPort=Number(process.env.ACCORD_SELLER_PORT||4318);
const websitePort=Number(process.env.ACCORD_WEB_PORT||4317);
const serviceProcesses=[];
let developmentChain;
let provider;
let shuttingDown=false;
let lockHandle;
async function shutdown(exitCode=0) {
  if(shuttingDown)return;shuttingDown=true;
  for(const serviceProcess of serviceProcesses) serviceProcess.kill('SIGTERM');
  await Promise.all(serviceProcesses.map(serviceProcess=>new Promise(resolve=>{
    if(serviceProcess.exitCode!==null)return resolve();
    serviceProcess.once('exit',resolve);setTimeout(()=>{serviceProcess.kill('SIGKILL');resolve();},2000).unref();
  })));
  provider?.destroy();
  if(developmentChain) await developmentChain.close().catch(()=>{});
  if(lockHandle){await lockHandle.close();await unlink(path.join(stateDirectory,'runtime.lock')).catch(()=>{});}
  process.exit(exitCode);
}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>shutdown());
async function waitForService(serviceUrl) {
  for(let readinessAttempt=0;readinessAttempt<100;readinessAttempt++) {
    if(shuttingDown)throw new Error('Runtime stopped');
    try{const response=await fetch(serviceUrl,{signal:AbortSignal.timeout(400)});if(response.ok)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error(`Service did not start: ${serviceUrl}`);
}
try {
  await mkdir(stateDirectory,{recursive:true,mode:0o700});
  lockHandle=await open(path.join(stateDirectory,'runtime.lock'),'wx',0o600);
  await lockHandle.writeFile(String(process.pid));
  const buyerWallet=Wallet.createRandom();const sellerWallet=Wallet.createRandom();const deployerWallet=Wallet.createRandom();
  developmentChain=await startDevelopmentChain({port:chainPort});
  for(const wallet of [buyerWallet,sellerWallet,deployerWallet]) await developmentChain.fundAddress(wallet.address,parseEther('10'));
  provider=new JsonRpcProvider(`http://127.0.0.1:${chainPort}`);
  const paymentContractArtifact=compileContract();
  const paymentContract=await new ContractFactory(paymentContractArtifact.abi,paymentContractArtifact.bytecode,deployerWallet.connect(provider)).deploy();
  await paymentContract.waitForDeployment();
  const configuration={chainId:'31337',rpcUrl:`http://127.0.0.1:${chainPort}`,contractAddress:await paymentContract.getAddress(),sellerUrl:`http://127.0.0.1:${sellerPort}`,buyerAddress:buyerWallet.address,sellerAddress:sellerWallet.address};
  const walletsPath=path.join(stateDirectory,'wallets.json');
  await writeFile(walletsPath,JSON.stringify({buyerPrivateKey:buyerWallet.privateKey,sellerPrivateKey:sellerWallet.privateKey}),{mode:0o600});await chmod(walletsPath,0o600);
  await writeFile(path.join(stateDirectory,'network.json'),JSON.stringify(configuration,null,2));
  for(const filename of ['seller.mjs','site.mjs']) {
    const serviceProcess=spawn(process.execPath,[path.join(projectDirectory,'runtime',filename)],{cwd:projectDirectory,env:{...process.env,ACCORD_STATE_DIR:stateDirectory,ACCORD_WEB_PORT:String(websitePort)},stdio:['ignore','inherit','inherit']});
    serviceProcesses.push(serviceProcess);serviceProcess.on('error',()=>shutdown(1));serviceProcess.on('exit',()=>{if(!shuttingDown)shutdown(1);});
  }
  await Promise.all([waitForService(`${configuration.sellerUrl}/health`),waitForService(`http://127.0.0.1:${websitePort}/api/health`)]);
  console.log(`Accord ready at http://127.0.0.1:${websitePort} — local development funds only.`);
} catch(error) {console.error(`Cannot start Accord: ${error.message}`);await shutdown(1);}
