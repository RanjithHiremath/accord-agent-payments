import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { Wallet, parseEther } from 'ethers';
import { startDevelopmentChain } from '../runtime/development-chain.mjs';

async function assertPortAvailable(port) {
  const listener = createServer();
  await new Promise((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(port, '127.0.0.1', resolve);
  });
  await new Promise((resolve, reject) => listener.close(error => error ? reject(error) : resolve()));
}

test('owned development chain starts with no unlocked accounts, funds explicit wallets, and releases its port', { timeout: 15000 }, async () => {
  const developmentChain = await startDevelopmentChain();
  const chainPort = Number(new URL(developmentChain.rpcUrl).port);
  try {
    assert.equal(new URL(developmentChain.rpcUrl).hostname, '127.0.0.1');
    assert.equal((await developmentChain.provider.getNetwork()).chainId, 31337n);
    assert.deepEqual(await developmentChain.provider.send('eth_accounts', []), []);
    const testWallet = Wallet.createRandom();
    const balanceWei = parseEther('2.5');
    await developmentChain.fundAddress(testWallet.address, balanceWei);
    assert.equal(await developmentChain.provider.getBalance(testWallet.address), balanceWei);
    assert.deepEqual(await developmentChain.provider.send('eth_accounts', []), []);
  } finally {
    await developmentChain.close();
  }
  await developmentChain.close();
  await assertPortAvailable(chainPort);
});

test('occupied chain port is rejected without altering or closing the original chain', { timeout: 15000 }, async () => {
  const originalChain = await startDevelopmentChain();
  try {
    const testWallet = Wallet.createRandom();
    const originalBalanceWei = parseEther('3');
    await originalChain.fundAddress(testWallet.address, originalBalanceWei);
    const originalBlockNumber = await originalChain.provider.send('eth_blockNumber', []);
    await assert.rejects(startDevelopmentChain({ port: Number(new URL(originalChain.rpcUrl).port) }), error => error.code === 'EADDRINUSE');
    assert.equal((await originalChain.provider.getNetwork()).chainId, 31337n);
    assert.equal(await originalChain.provider.getBalance(testWallet.address), originalBalanceWei);
    assert.equal(await originalChain.provider.send('eth_blockNumber', []), originalBlockNumber);
    assert.deepEqual(await originalChain.provider.send('eth_accounts', []), []);
    await originalChain.provider.send('evm_mine', []);
    assert.equal(BigInt(await originalChain.provider.send('eth_blockNumber', [])), BigInt(originalBlockNumber) + 1n);
  } finally {
    await originalChain.close();
  }
});
