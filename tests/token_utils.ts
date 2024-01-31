import { Keypair, PublicKey, TransactionInstruction, TransactionSignature } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

import {
  buildAndSendTxnWithLogs,
  buildVersionedTransaction,
  createAssociatedTokenAccountIdempotentInstruction,
} from '../src';
import { Env } from './setup_utils';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function createMint(
  env: Env,
  authority: PublicKey,
  decimals: number = 6,
  mintOverride?: Keypair
): Promise<PublicKey> {
  if (mintOverride) {
    return await createMintFromKeypair(env, authority, mintOverride, decimals);
  }
  const mint = anchor.web3.Keypair.generate();
  return await createMintFromKeypair(env, authority, mint, decimals);
}

export async function createMintFromKeypair(
  env: Env,
  authority: PublicKey,
  mint: Keypair,
  decimals: number = 6
): Promise<PublicKey> {
  const instructions = await createMintInstructions(env, authority, mint.publicKey, decimals);

  const tx = await buildVersionedTransaction(env.provider.connection, env.wallet.payer.publicKey, instructions);

  await buildAndSendTxnWithLogs(env.provider.connection, tx, env.wallet.payer, [mint]);
  return mint.publicKey;
}

async function createMintInstructions(
  env: Env,
  authority: PublicKey,
  mint: PublicKey,
  decimals: number
): Promise<TransactionInstruction[]> {
  return [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: env.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await env.provider.connection.getMinimumBalanceForRentExemption(82),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint, decimals, authority, null),
  ];
}

export async function createAta(
  env: Env,
  owner: PublicKey,
  mint: PublicKey
): Promise<[TransactionSignature, PublicKey]> {
  const [ata, ix] = await createAssociatedTokenAccountIdempotentInstruction(owner, mint, env.admin.publicKey);

  const tx = await buildVersionedTransaction(env.provider.connection, env.admin.publicKey, [ix]);

  const sig = await buildAndSendTxnWithLogs(env.provider.connection, tx, env.admin, []);
  return [sig, ata];
}

export function getMintToIx(
  authority: PublicKey,
  mintPubkey: PublicKey,
  tokenAccount: PublicKey,
  amount: number
): TransactionInstruction {
  const ix = Token.createMintToInstruction(
    TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
    mintPubkey, // mint
    tokenAccount, // receiver (sholud be a token account)
    authority, // mint authority
    [], // only multisig account will use. leave it empty now.
    amount // amount. if your decimals is 8, you mint 10^8 for 1 token.
  );

  return ix;
}

export function getBurnFromIx(
  signer: PublicKey,
  mintPubkey: PublicKey,
  tokenAccount: PublicKey,
  amount: number
): TransactionInstruction {
  console.log(`burnFrom ${tokenAccount.toString()} mint ${mintPubkey.toString()} amount ${amount}`);
  const ix = Token.createBurnInstruction(TOKEN_PROGRAM_ID, mintPubkey, tokenAccount, signer, [], amount);
  return ix;
}

export async function mintTo(
  env: Env,
  mint: PublicKey,
  recipient: PublicKey,
  amount: number,
  createAtaIxns: TransactionInstruction[] = []
): Promise<TransactionSignature> {
  const instruction = getMintToIx(env.admin.publicKey, mint, recipient, amount);

  const tx = await buildVersionedTransaction(env.provider.connection, env.wallet.payer.publicKey, [
    ...createAtaIxns,
    instruction,
  ]);

  const sig = await buildAndSendTxnWithLogs(env.provider.connection, tx, env.wallet.payer, []);
  return sig;
}
