import {
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Connection,
  GetProgramAccountsFilter,
} from '@solana/web3.js';
import { KaminoMarket } from '../classes';
import {
  LeverageObligation,
  MultiplyObligation,
  WRAPPED_SOL_MINT,
  createLookupTableIx,
  extendLookupTableIxs,
  getAssociatedTokenAddress,
  initUserMetadata,
  referrerTokenStatePda,
  userMetadataPda,
  isNotNullPubkey,
  UserMetadata,
  updateUserMetadataOwner,
  PROGRAM_ID,
  PublicKeySet,
} from '../lib';
import { chunks } from '@hubbleprotocol/kamino-sdk';
import { farmsId } from '@hubbleprotocol/farms-sdk';
import { KaminoReserve } from '../classes/reserve';

export type KaminoUserMetadata = {
  address: PublicKey;
  state: UserMetadata;
};

export const getUserLutAddressAndSetupIxns = async (
  kaminoMarket: KaminoMarket,
  user: PublicKey,
  referrer: PublicKey = PublicKey.default,
  withExtendLut: boolean = true,
  multiplyMints: { coll: PublicKey; debt: PublicKey }[] = [],
  leverageMints: { coll: PublicKey; debt: PublicKey }[] = [],
  payer: PublicKey = PublicKey.default
): Promise<[PublicKey, TransactionInstruction[][]]> => {
  const [userMetadataAddress, userMetadataState] = await kaminoMarket.getUserMetadata(user);
  const initUserMetadataIxs: TransactionInstruction[] = [];
  let userLookupTableAddress: PublicKey;

  const referrerUserMetadata = referrer.equals(PublicKey.default)
    ? kaminoMarket.programId
    : (await kaminoMarket.getUserMetadata(referrer))[0];

  if (!userMetadataState) {
    const [createLutIx, lookupTableAddress] = await createLookupTableIx(kaminoMarket.getConnection(), user);
    userLookupTableAddress = lookupTableAddress;
    initUserMetadataIxs.push(createLutIx);
    initUserMetadataIxs.push(
      initUserMetadata(
        {
          userLookupTable: lookupTableAddress,
        },
        {
          owner: user,
          feePayer: payer.equals(PublicKey.default) ? user : payer,
          userMetadata: userMetadataAddress,
          referrerUserMetadata: referrerUserMetadata,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
        }
      )
    );
  } else {
    userLookupTableAddress = userMetadataState.userLookupTable;
  }

  const setupUserMetadataIxs = [initUserMetadataIxs];

  if (withExtendLut) {
    const dedupUserLutAddresses = await getDedupUserLookupTableAddresses(
      kaminoMarket,
      userLookupTableAddress,
      user,
      referrer,
      multiplyMints,
      leverageMints,
      userMetadataState !== null
    );

    const extendLookupTableChunkIxs = extendLookupTableIxs(user, userLookupTableAddress, dedupUserLutAddresses, payer);

    for (const extendLutIx of extendLookupTableChunkIxs) {
      setupUserMetadataIxs.push([extendLutIx]);
    }
  }

  return [userLookupTableAddress, setupUserMetadataIxs];
};

const getDedupUserLookupTableAddresses = async (
  kaminoMarket: KaminoMarket,
  table_pk: PublicKey,
  user: PublicKey,
  referrer: PublicKey,
  multiplyMints: { coll: PublicKey; debt: PublicKey }[] = [],
  leverageMints: { coll: PublicKey; debt: PublicKey }[] = [],
  tableExists: boolean
): Promise<PublicKey[]> => {
  const requiredAddresses = await getUserLookupTableAddresses(
    kaminoMarket,
    user,
    referrer,
    multiplyMints,
    leverageMints
  );

  if (tableExists) {
    const userLookupTable = (await kaminoMarket.getConnection().getAddressLookupTable(table_pk)).value?.state!;
    return requiredAddresses.filter(
      (address) => userLookupTable.addresses.filter((a) => a.equals(address)).length === 0
    );
  } else {
    return requiredAddresses;
  }
};

const getUserLookupTableAddresses = async (
  kaminoMarket: KaminoMarket,
  user: PublicKey,
  referrer: PublicKey,
  multiplyMints: { coll: PublicKey; debt: PublicKey }[] = [],
  leverageMints: { coll: PublicKey; debt: PublicKey }[] = []
): Promise<PublicKey[]> => {
  const addresses: PublicKey[] = [];
  addresses.push(user);
  const [userMetadataAddress] = userMetadataPda(user, kaminoMarket.programId);
  addresses.push(userMetadataAddress);

  const allMints: PublicKey[] = [];
  multiplyMints.forEach(({ coll: collMint, debt: debtMint }) => {
    allMints.push(collMint);
    allMints.push(debtMint);
  });
  leverageMints.forEach(({ coll: collMint, debt: debtMint }) => {
    allMints.push(collMint);
    allMints.push(debtMint);
  });
  const dedupMints = [...new PublicKeySet(allMints).toArray()];
  const reserves: KaminoReserve[] = [];
  dedupMints.forEach((mint) => {
    const kaminoReserve = kaminoMarket.getReserveByMint(mint);
    if (kaminoReserve) {
      reserves.push(kaminoReserve);
    }
  });

  // reserve mint ATAs
  const mintsAtas: PublicKey[] = await Promise.all(dedupMints.map((mint) => getAssociatedTokenAddress(mint, user)));
  addresses.push(...mintsAtas);
  // ctoken ATAs
  const ctokenMints: PublicKey[] = reserves.map((reserve) => reserve.getCTokenMint());
  const ctokenMintsAtas: PublicKey[] = await Promise.all(
    ctokenMints.map((mint) => getAssociatedTokenAddress(mint, user))
  );
  addresses.push(...ctokenMintsAtas);
  // farm states
  const farmCollateralStates: PublicKey[] = reserves.map((reserve) => reserve.state.farmCollateral);
  const farmDebtStates: PublicKey[] = reserves.map((reserve) => reserve.state.farmDebt);
  const farmStates = new Set(farmCollateralStates.concat(farmDebtStates).filter((address) => isNotNullPubkey(address)));
  addresses.push(...farmStates);
  // referrer token states
  const referrerTokenStates: PublicKey[] = reserves.map(
    (reserve) => referrerTokenStatePda(referrer, reserve.address, kaminoMarket.programId)[0]
  );
  addresses.push(...referrerTokenStates);

  const [multiplyObligations, multiplyObligationsFarmUserStates] = getMultiplyObligationAndObligationFarmStateAddresses(
    kaminoMarket,
    user,
    multiplyMints
  );

  addresses.push(...new PublicKeySet(multiplyObligations).toArray());
  addresses.push(...new PublicKeySet(multiplyObligationsFarmUserStates).toArray());

  const [leverageObligations, leverageObligationsFarmUserStates] = getLeverageObligationAndObligationFarmStateAddresses(
    kaminoMarket,
    user,
    leverageMints
  );

  addresses.push(...new PublicKeySet(leverageObligations).toArray());
  addresses.push(...new PublicKeySet(leverageObligationsFarmUserStates).toArray());

  return addresses;
};

function getMultiplyObligationAndObligationFarmStateAddresses(
  kaminoMarket: KaminoMarket,
  user: PublicKey,
  mints: { coll: PublicKey; debt: PublicKey }[]
): [PublicKey[], PublicKey[]] {
  const obligationPdas: PublicKey[] = [];
  const farmUserStates: PublicKey[] = [];

  for (const { coll: collMint, debt: debtMint } of mints) {
    const collReserve = kaminoMarket.getReserveByMint(collMint);
    const debtReserve = kaminoMarket.getReserveByMint(debtMint);
    if (collReserve && debtReserve) {
      const multiplyObligation = new MultiplyObligation(collMint, WRAPPED_SOL_MINT, kaminoMarket.programId);
      obligationPdas.push(multiplyObligation.toPda(kaminoMarket.getAddress(), user));
      if (!collReserve.state.farmCollateral.equals(PublicKey.default)) {
        farmUserStates.push(
          getPdaFarmsUserState(
            collReserve.state.farmCollateral!,
            multiplyObligation.toPda(kaminoMarket.getAddress(), user)
          )
        );
      }
      if (!debtReserve.state.farmDebt.equals(PublicKey.default)) {
        farmUserStates.push(
          getPdaFarmsUserState(debtReserve.state.farmDebt!, multiplyObligation.toPda(kaminoMarket.getAddress(), user))
        );
      }
    }
  }

  return [obligationPdas, farmUserStates];
}

function getLeverageObligationAndObligationFarmStateAddresses(
  kaminoMarket: KaminoMarket,
  user: PublicKey,
  mints: { coll: PublicKey; debt: PublicKey }[]
): [PublicKey[], PublicKey[]] {
  const obligationPdas: PublicKey[] = [];
  const farmUserStates: PublicKey[] = [];

  for (const { coll: collMint, debt: debtMint } of mints) {
    const collReserve = kaminoMarket.getReserveByMint(collMint);
    const debtReserve = kaminoMarket.getReserveByMint(debtMint);
    if (collReserve && debtReserve) {
      const leverageObligation = new LeverageObligation(collMint, debtMint, kaminoMarket.programId);
      obligationPdas.push(leverageObligation.toPda(kaminoMarket.getAddress(), user));
      if (!collReserve.state.farmCollateral.equals(PublicKey.default)) {
        farmUserStates.push(
          getPdaFarmsUserState(
            collReserve.state.farmCollateral!,
            leverageObligation.toPda(kaminoMarket.getAddress(), user)
          )
        );
      }
      if (!debtReserve.state.farmDebt.equals(PublicKey.default)) {
        farmUserStates.push(
          getPdaFarmsUserState(debtReserve.state.farmDebt!, leverageObligation.toPda(kaminoMarket.getAddress(), user))
        );
      }
    }
  }

  return [obligationPdas, farmUserStates];
}

const BASE_SEED_USER_STATE = Buffer.from('user');

const getPdaFarmsUserState = (farm: PublicKey, obligation: PublicKey) =>
  PublicKey.findProgramAddressSync([BASE_SEED_USER_STATE, farm.toBytes(), obligation.toBytes()], farmsId)[0];

export async function* batchGetAllUserMetadatasWithoutOwner(
  connection: Connection,
  programId: PublicKey
): AsyncGenerator<KaminoUserMetadata[], void, unknown> {
  const filters = [
    {
      dataSize: UserMetadata.layout.span + 8,
    },
    {
      memcmp: {
        offset: 80,
        bytes: PublicKey.default.toBase58(),
      },
    },
  ];

  const userMetadataPubkeys = await connection.getProgramAccounts(programId, {
    filters,
  });

  for (const batch of chunks(
    userMetadataPubkeys.map((x) => x.pubkey),
    100
  )) {
    const userMetadataAccounts = await connection.getMultipleAccountsInfo(batch);
    const userMetadatasBatch: KaminoUserMetadata[] = [];
    for (let i = 0; i < userMetadataAccounts.length; i++) {
      const userMetadata = userMetadataAccounts[i];
      const pubkey = batch[i];
      if (userMetadata === null) {
        continue;
      }

      const userMetadataAccount = UserMetadata.decode(userMetadata.data);

      if (!userMetadataAccount) {
        throw Error(`Could not decode userMetadataAccount ${pubkey.toString()}`);
      }

      userMetadatasBatch.push({ address: pubkey, state: userMetadataAccount });
    }
    yield userMetadatasBatch;
  }
}

export async function getAllUserMetadatasWithFilter(
  connection: Connection,
  filter: GetProgramAccountsFilter[],
  programId: PublicKey
): Promise<KaminoUserMetadata[]> {
  const filters = [
    {
      dataSize: UserMetadata.layout.span + 8,
    },
    ...filter,
  ];

  const userMetadatas = await connection.getProgramAccounts(programId, {
    filters,
  });

  return userMetadatas.map((userMetadata) => {
    if (userMetadata.account === null) {
      throw new Error('Invalid account');
    }
    if (!userMetadata.account.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program");
    }

    const userMetadataAccount = UserMetadata.decode(userMetadata.account.data);

    if (!userMetadataAccount) {
      throw Error('Could not parse user metadata.');
    }

    return { address: userMetadata.pubkey, state: userMetadataAccount };
  });
}

export async function updateUserMetadataOwnerIx(
  connection: Connection,
  userMetadata: KaminoUserMetadata,
  programId: PublicKey = PROGRAM_ID
): Promise<TransactionInstruction | null> {
  if (userMetadata.state.userLookupTable.equals(PublicKey.default)) {
    // user has no lookuptable
    return null;
  }
  const userLookupTable = await connection.getAddressLookupTable(userMetadata.state.userLookupTable);
  return updateUserMetadataOwner(
    {
      owner: userLookupTable?.value?.state.authority!,
    },
    {
      userMetadata: userMetadata.address,
    },
    programId
  );
}
