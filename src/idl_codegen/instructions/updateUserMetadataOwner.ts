import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateUserMetadataOwnerArgs {
  owner: PublicKey
}

export interface UpdateUserMetadataOwnerAccounts {
  userMetadata: PublicKey
}

export const layout = borsh.struct([borsh.publicKey("owner")])

export function updateUserMetadataOwner(
  args: UpdateUserMetadataOwnerArgs,
  accounts: UpdateUserMetadataOwnerAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.userMetadata, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([83, 111, 21, 58, 230, 131, 5, 236])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      owner: args.owner,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
