import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface ElevationGroupFields {
  maxLiquidationBonusBps: number
  id: number
  ltvPct: number
  liquidationThresholdPct: number
  allowNewLoans: number
  reserved: Array<number>
  padding: Array<BN>
}

export interface ElevationGroupJSON {
  maxLiquidationBonusBps: number
  id: number
  ltvPct: number
  liquidationThresholdPct: number
  allowNewLoans: number
  reserved: Array<number>
  padding: Array<string>
}

export class ElevationGroup {
  readonly maxLiquidationBonusBps: number
  readonly id: number
  readonly ltvPct: number
  readonly liquidationThresholdPct: number
  readonly allowNewLoans: number
  readonly reserved: Array<number>
  readonly padding: Array<BN>

  constructor(fields: ElevationGroupFields) {
    this.maxLiquidationBonusBps = fields.maxLiquidationBonusBps
    this.id = fields.id
    this.ltvPct = fields.ltvPct
    this.liquidationThresholdPct = fields.liquidationThresholdPct
    this.allowNewLoans = fields.allowNewLoans
    this.reserved = fields.reserved
    this.padding = fields.padding
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u16("maxLiquidationBonusBps"),
        borsh.u8("id"),
        borsh.u8("ltvPct"),
        borsh.u8("liquidationThresholdPct"),
        borsh.u8("allowNewLoans"),
        borsh.array(borsh.u8(), 2, "reserved"),
        borsh.array(borsh.u64(), 8, "padding"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ElevationGroup({
      maxLiquidationBonusBps: obj.maxLiquidationBonusBps,
      id: obj.id,
      ltvPct: obj.ltvPct,
      liquidationThresholdPct: obj.liquidationThresholdPct,
      allowNewLoans: obj.allowNewLoans,
      reserved: obj.reserved,
      padding: obj.padding,
    })
  }

  static toEncodable(fields: ElevationGroupFields) {
    return {
      maxLiquidationBonusBps: fields.maxLiquidationBonusBps,
      id: fields.id,
      ltvPct: fields.ltvPct,
      liquidationThresholdPct: fields.liquidationThresholdPct,
      allowNewLoans: fields.allowNewLoans,
      reserved: fields.reserved,
      padding: fields.padding,
    }
  }

  toJSON(): ElevationGroupJSON {
    return {
      maxLiquidationBonusBps: this.maxLiquidationBonusBps,
      id: this.id,
      ltvPct: this.ltvPct,
      liquidationThresholdPct: this.liquidationThresholdPct,
      allowNewLoans: this.allowNewLoans,
      reserved: this.reserved,
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: ElevationGroupJSON): ElevationGroup {
    return new ElevationGroup({
      maxLiquidationBonusBps: obj.maxLiquidationBonusBps,
      id: obj.id,
      ltvPct: obj.ltvPct,
      liquidationThresholdPct: obj.liquidationThresholdPct,
      allowNewLoans: obj.allowNewLoans,
      reserved: obj.reserved,
      padding: obj.padding.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return ElevationGroup.toEncodable(this)
  }
}
