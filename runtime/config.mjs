import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
export const stateDirectory = process.env.ACCORD_STATE_DIR || path.join(projectDirectory, '.local');
export async function readConfiguration() { return JSON.parse(await readFile(path.join(stateDirectory, 'network.json'), 'utf8')); }
export async function readWallets() { return JSON.parse(await readFile(path.join(stateDirectory, 'wallets.json'), 'utf8')); }
export function publicConfiguration(configuration) { const {chainId,rpcUrl,contractAddress,sellerUrl,buyerAddress,sellerAddress} = configuration; return {chainId,rpcUrl,contractAddress,sellerUrl,buyerAddress,sellerAddress}; }
