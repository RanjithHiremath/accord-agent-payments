import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { createRequire } from 'node:module';
import { setTimeout as waitForMilliseconds } from 'node:timers/promises';
import { JsonRpcProvider, Wallet, parseEther, toBeHex } from 'ethers';

const requireFromProject = createRequire(import.meta.url);

async function reserveAndReleaseLoopbackPort(requestedPort = 0) {
  const portProbe = createServer();
  await new Promise((resolve, reject) => {
    portProbe.once('error', reject);
    portProbe.listen(requestedPort, '127.0.0.1', resolve);
  });
  const availablePort = portProbe.address().port;
  await new Promise((resolve, reject) => portProbe.close(error => error ? reject(error) : resolve()));
  return availablePort;
}

/** Starts a disposable development chain. Never supplies or accepts public-network funds. */
export async function startDevelopmentChain({ port = 0, accounts = [] } = {}) {
  if (!Number.isSafeInteger(port) || port < 0 || port > 65535) {
    throw new Error('Development chain port must be zero or an integer between 1 and 65535.');
  }
  // Refuse to attach to an existing service, even if it advertises our chain ID.
  const chainPort = await reserveAndReleaseLoopbackPort(port);
  const architectureName = process.arch === 'x64' ? 'amd64' : process.arch;
  const executableName = process.platform === 'win32' ? 'anvil.exe' : 'anvil';
  const platformPackage = `@foundry-rs/anvil-${process.platform}-${architectureName}`;
  let executablePath;
  try {
    executablePath = requireFromProject.resolve(`${platformPackage}/bin/${executableName}`);
  } catch {
    throw new Error(`Anvil is not installed for ${process.platform}/${process.arch}. Run npm install with optional dependencies enabled.`);
  }
  const chainProcess = spawn(executablePath, [
    '--host', '127.0.0.1', '--port', String(chainPort), '--chain-id', '31337',
    '--accounts', '0', '--hardfork', 'shanghai', '--no-cors', '--color', 'never',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let startupError = null;
  let diagnosticOutput = '';
  let startupOutput = '';
  let ownedProcessListening = false;
  chainProcess.once('error', error => { startupError = error; });
  // Consume startup output privately: never forward node account or seed output.
  chainProcess.stdout.on('data', chunk => {
    startupOutput = (startupOutput + chunk.toString()).slice(-4000);
    if (startupOutput.includes(`Listening on 127.0.0.1:${chainPort}`)) ownedProcessListening = true;
  });
  chainProcess.stderr.on('data', chunk => { diagnosticOutput = (diagnosticOutput + chunk.toString()).slice(-2000); });
  const rpcUrl = `http://127.0.0.1:${chainPort}`;
  let provider;
  let chainClosed = false;
  async function close() {
    if (chainClosed) return;
    chainClosed = true;
    if (provider) provider.destroy();
    if (chainProcess.exitCode !== null || chainProcess.signalCode !== null || startupError) return;
    const processExited = new Promise(resolve => chainProcess.once('exit', resolve));
    chainProcess.kill('SIGTERM');
    const terminationTimer = setTimeout(() => chainProcess.kill('SIGKILL'), 3000);
    terminationTimer.unref();
    await processExited;
    clearTimeout(terminationTimer);
  }
  try {
    let chainReady = false;
    for (let readinessAttempt = 0; readinessAttempt < 100; readinessAttempt += 1) {
      if (startupError) throw startupError;
      if (chainProcess.exitCode !== null) throw new Error(`Anvil exited before startup: ${diagnosticOutput}`);
      if (!ownedProcessListening) { await waitForMilliseconds(50); continue; }
      try {
        const readinessResponse = await fetch(rpcUrl, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }),
          signal: AbortSignal.timeout(300),
        });
        const networkResponse = await readinessResponse.json();
        if (networkResponse.result === '0x7a69') { chainReady = true; break; }
      } catch { /* The newly spawned process may not yet be listening. */ }
      await waitForMilliseconds(50);
    }
    if (!chainReady) throw new Error('The local development chain did not become ready.');
    provider = new JsonRpcProvider(rpcUrl, undefined, { cacheTimeout: -1 });
    async function fundAddress(address, balanceWei = parseEther('100')) {
      await provider.send('anvil_setBalance', [address, toBeHex(BigInt(balanceWei))]);
    }
    const fundedAccounts = accounts.map(account => {
      const accountWallet = new Wallet(account.secretKey);
      return { ...account, address: accountWallet.address };
    });
    for (const fundedAccount of fundedAccounts) {
      await fundAddress(fundedAccount.address, fundedAccount.balance ?? parseEther('100'));
    }
    return { rpcUrl, provider, accounts: fundedAccounts, close, fundAddress };
  } catch (startupFailure) {
    await close();
    throw startupFailure;
  }
}
