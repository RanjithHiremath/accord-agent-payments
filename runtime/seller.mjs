import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { Contract, JsonRpcProvider, Wallet, getAddress } from 'ethers';
import { compileContract, domain, quoteTypes, profile, hashRequest, hashResult, validateOffer } from '../lib/protocol.mjs';
import { readConfiguration, readWallets } from './config.mjs';
import { json, readJson, enforceLocalRequest } from './http.mjs';
const configuration = await readConfiguration();
const sellerPort = Number(new URL(configuration.sellerUrl).port);
const provider = new JsonRpcProvider(configuration.rpcUrl);
const sellerWallet = new Wallet((await readWallets()).sellerPrivateKey, provider);
const paymentContract = new Contract(configuration.contractAddress, compileContract().abi, provider);
const priceWei = '100000000000000';
const sellerServer = http.createServer(async (request, response) => {
  try {
    enforceLocalRequest(request, sellerPort);
    const requestPath = new URL(request.url, configuration.sellerUrl).pathname;
    if (request.method === 'GET' && requestPath === '/health') return json(response, 200, {ok:true,role:'seller',seller:configuration.sellerAddress});
    if (request.method === 'GET' && requestPath === '/.well-known/accord.json') return json(response, 200, {protocol:'accord/0.1',service:'dataset.profile.v1',seller:configuration.sellerAddress,chainId:configuration.chainId,contractAddress:configuration.contractAddress,priceWei});
    if (request.method !== 'POST') return json(response,404,{error:'Not found'});
    const payload = await readJson(request);
    if (requestPath === '/quote') {
      const datasetSummary = profile(payload.values);
      const quote = {buyer:getAddress(payload.buyer),seller:configuration.sellerAddress,amount:priceWei,requestHash:hashRequest(payload.values),resultHash:hashResult(datasetSummary),nonce:`0x${randomBytes(32).toString('hex')}`,expiry:String(Math.floor(Date.now()/1000)+120)};
      const signature = await sellerWallet.signTypedData(domain(configuration.chainId,configuration.contractAddress),quoteTypes,quote);
      return json(response,200,{protocol:'accord/0.1',service:'dataset.profile.v1',chainId:configuration.chainId,contractAddress:configuration.contractAddress,quote,signature,request:{values:payload.values}});
    }
    if (requestPath === '/deliver') {
      const offer = payload.offer;
      const quoteIdentifier = validateOffer(offer,{buyer:offer?.quote?.buyer,seller:configuration.sellerAddress,chainId:configuration.chainId,contractAddress:configuration.contractAddress,values:offer?.request?.values,maxPaymentWei:priceWei,nowSeconds:'0'});
      if (!await paymentContract.paid(quoteIdentifier)) return json(response,402,{error:'Offer has not been paid'});
      return json(response,200,{quoteId:quoteIdentifier,result:profile(offer.request.values),resultHash:offer.quote.resultHash});
    }
    json(response,404,{error:'Not found'});
  } catch (error) { json(response,400,{error:error.shortMessage || error.message}); }
});
sellerServer.requestTimeout = 15000;
sellerServer.listen(sellerPort,'127.0.0.1',()=>console.log(`Seller listening on ${configuration.sellerUrl}`));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>sellerServer.close(()=>{provider.destroy();process.exit(0);}));
