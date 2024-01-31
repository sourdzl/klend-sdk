import { Kamino } from '@hubbleprotocol/kamino-sdk';
import { MintInfo, MintLayout, u64 } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export async function isKtoken(mintKey: PublicKey, kamino: Kamino): Promise<boolean> {
  const [expectedMintAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('authority'), mintKey.toBuffer()],
    kamino.getProgramID()
  );
  const mintInfo = deserializeMint((await kamino.getConnection().getAccountInfo(mintKey))?.data!);
  return mintInfo.mintAuthority !== null && mintInfo.mintAuthority.equals(expectedMintAuthority);
}

function deserializeMint(data: Buffer): MintInfo {
  if (data.length !== MintLayout.span) {
    throw new Error('Not a valid Mint');
  }

  const mintInfo = MintLayout.decode(data);

  if (mintInfo.mintAuthorityOption === 0) {
    mintInfo.mintAuthority = null;
  } else {
    mintInfo.mintAuthority = new PublicKey(mintInfo.mintAuthority);
  }

  mintInfo.supply = u64.fromBuffer(mintInfo.supply);
  mintInfo.isInitialized = mintInfo.isInitialized !== 0;

  if (mintInfo.freezeAuthorityOption === 0) {
    mintInfo.freezeAuthority = null;
  } else {
    mintInfo.freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
  }

  return mintInfo;
}
