import { JsonRpcProvider, Wallet } from 'ethers';
import { pathToFileURL } from 'node:url';
import { payOffer, hashResult } from '../lib/protocol.mjs';
import { readConfiguration, readWallets } from './config.mjs';
import { requestJson } from './http.mjs';
export async function runDemo({scenario='success', values=[12,18,24,30,36]}={}) {
  if (!['success','replay','budget'].includes(scenario)) throw new Error('Unknown demonstration scenario');
  const startedAtMilliseconds = Date.now();
  const configuration = await readConfiguration();
  const provider = new JsonRpcProvider(configuration.rpcUrl);
  try {
    const buyerWallet = new Wallet((await readWallets()).buyerPrivateKey,provider);
    const steps = [];
    const offer = await requestJson(`${configuration.sellerUrl}/quote`,{buyer:buyerWallet.address,values});
    steps.push({name:'Signed offer',status:'passed',detail:'Seller returned a signed price and request commitment.'});
    const expectedOffer = {buyer:buyerWallet.address,seller:configuration.sellerAddress,chainId:configuration.chainId,contractAddress:configuration.contractAddress,values,maxPaymentWei:scenario === 'budget' ? '1':'100000000000000',nowSeconds:String(Math.floor(Date.now()/1000))};
    const paymentOptions = {wallet:buyerWallet,provider,expected:expectedOffer,maxGasWei:'1000000000000000',maxTotalWei:'1100000000000000'};
    const exchangeSummary = {scenario,buyer:buyerWallet.address,seller:configuration.sellerAddress,network:'Local development chain',currency:'Test ETH',steps};
    let paymentReceipt;
    try { paymentReceipt = await payOffer(offer,paymentOptions); }
    catch (error) {
      if (scenario !== 'budget' || !/budget|limit|maximum|exceed|cap/i.test(error.message)) throw error;
      steps.push({name:'Spending policy',status:'passed',detail:'Buyer rejected the quoted amount above its per-purchase budget before submitting payment.'});
      return {...exchangeSummary,ok:true,summary:'Budget protected: no payment submitted.',durationMs:Date.now()-startedAtMilliseconds};
    }
    if (scenario === 'budget') throw new Error('Budget scenario unexpectedly paid');
    steps.push({name:'Payment confirmed',status:'passed',detail:`Contract confirmed payment in block ${paymentReceipt.blockNumber}.`});
    if (scenario === 'replay') {
      const replayReceipt = await payOffer(offer,paymentOptions);
      if (!replayReceipt.reused || replayReceipt.transactionHash !== paymentReceipt.transactionHash) throw new Error('Replay did not recover original payment');
      paymentReceipt = replayReceipt;
      steps.push({name:'Replay protection',status:'passed',detail:'Repeated authorization recovered the original transaction without another charge.'});
    }
    const serviceDelivery = await requestJson(`${configuration.sellerUrl}/deliver`,{offer});
    if (hashResult(serviceDelivery.result) !== offer.quote.resultHash || serviceDelivery.quoteId !== paymentReceipt.quoteId) throw new Error('Delivered result does not match the signed commitment');
    steps.push({name:'Delivery verified',status:'passed',detail:'Received the dataset profile and checked its signed result commitment.'});
    return {...exchangeSummary,...paymentReceipt,ok:true,result:serviceDelivery.result,summary:scenario==='replay'?'Same offer retried. One payment, verified delivery.':'Two agents completed a paid exchange.',durationMs:Date.now()-startedAtMilliseconds};
  } finally { provider.destroy(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { const demoOptions = process.argv[2]?.startsWith('{') ? JSON.parse(process.argv[2]):{scenario:process.argv[2]||'success'}; console.log(JSON.stringify(await runDemo(demoOptions))); }
  catch (error) { console.error(JSON.stringify({ok:false,error:error.shortMessage||error.message})); process.exitCode=1; }
}
