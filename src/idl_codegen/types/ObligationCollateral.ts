import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface ObligationCollateralFields {
  /** Reserve collateral is deposited to */
  depositReserve: PublicKey
  /** Amount of collateral deposited */
  depositedAmount: BN
  /** Collateral market value in quote currency (scaled fraction) */
  marketValueSf: BN
  padding: Array<BN>
}

export interface ObligationCollateralJSON {
  /** Reserve collateral is deposited to */
  depositReserve: string
  /** Amount of collateral deposited */
  depositedAmount: string
  /** Collateral market value in quote currency (scaled fraction) */
  marketValueSf: string
  padding: Array<string>
}

/** Obligation collateral state */
export class ObligationCollateral {
  /** Reserve collateral is deposited to */
  readonly depositReserve: PublicKey
  /** Amount of collateral deposited */
  readonly depositedAmount: BN
  /** Collateral market value in quote currency (scaled fraction) */
  readonly marketValueSf: BN
  readonly padding: Array<BN>

  constructor(fields: ObligationCollateralFields) {
    this.depositReserve = fields.depositReserve
    this.depositedAmount = fields.depositedAmount
    this.marketValueSf = fields.marketValueSf
    this.padding = fields.padding
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("depositReserve"),
        borsh.u64("depositedAmount"),
        borsh.u128("marketValueSf"),
        borsh.array(borsh.u64(), 10, "padding"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ObligationCollateral({
      depositReserve: obj.depositReserve,
      depositedAmount: obj.depositedAmount,
      marketValueSf: obj.marketValueSf,
      padding: obj.padding,
    })
  }

  static toEncodable(fields: ObligationCollateralFields) {
    return {
      depositReserve: fields.depositReserve,
      depositedAmount: fields.depositedAmount,
      marketValueSf: fields.marketValueSf,
      padding: fields.padding,
    }
  }

  toJSON(): ObligationCollateralJSON {
    return {
      depositReserve: this.depositReserve.toString(),
      depositedAmount: this.depositedAmount.toString(),
      marketValueSf: this.marketValueSf.toString(),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: ObligationCollateralJSON): ObligationCollateral {
    return new ObligationCollateral({
      depositReserve: new PublicKey(obj.depositReserve),
      depositedAmount: new BN(obj.depositedAmount),
      marketValueSf: new BN(obj.marketValueSf),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return ObligationCollateral.toEncodable(this)
  }
}
