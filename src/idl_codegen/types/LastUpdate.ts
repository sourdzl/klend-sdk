import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface LastUpdateFields {
  /** Last slot when updated */
  slot: BN
  /** True when marked stale, false when slot updated */
  stale: number
  placeholder: Array<number>
}

export interface LastUpdateJSON {
  /** Last slot when updated */
  slot: string
  /** True when marked stale, false when slot updated */
  stale: number
  placeholder: Array<number>
}

/** Last update state */
export class LastUpdate {
  /** Last slot when updated */
  readonly slot: BN
  /** True when marked stale, false when slot updated */
  readonly stale: number
  readonly placeholder: Array<number>

  constructor(fields: LastUpdateFields) {
    this.slot = fields.slot
    this.stale = fields.stale
    this.placeholder = fields.placeholder
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("slot"),
        borsh.u8("stale"),
        borsh.array(borsh.u8(), 7, "placeholder"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LastUpdate({
      slot: obj.slot,
      stale: obj.stale,
      placeholder: obj.placeholder,
    })
  }

  static toEncodable(fields: LastUpdateFields) {
    return {
      slot: fields.slot,
      stale: fields.stale,
      placeholder: fields.placeholder,
    }
  }

  toJSON(): LastUpdateJSON {
    return {
      slot: this.slot.toString(),
      stale: this.stale,
      placeholder: this.placeholder,
    }
  }

  static fromJSON(obj: LastUpdateJSON): LastUpdate {
    return new LastUpdate({
      slot: new BN(obj.slot),
      stale: obj.stale,
      placeholder: obj.placeholder,
    })
  }

  toEncodable() {
    return LastUpdate.toEncodable(this)
  }
}
