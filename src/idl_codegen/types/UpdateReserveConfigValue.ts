import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export type BoolFields = [boolean]
export type BoolValue = [boolean]

export interface BoolJSON {
  kind: "Bool"
  value: [boolean]
}

export class Bool {
  static readonly discriminator = 0
  static readonly kind = "Bool"
  readonly discriminator = 0
  readonly kind = "Bool"
  readonly value: BoolValue

  constructor(value: BoolFields) {
    this.value = [value[0]]
  }

  toJSON(): BoolJSON {
    return {
      kind: "Bool",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      Bool: {
        _0: this.value[0],
      },
    }
  }
}

export type U8Fields = [number]
export type U8Value = [number]

export interface U8JSON {
  kind: "U8"
  value: [number]
}

export class U8 {
  static readonly discriminator = 1
  static readonly kind = "U8"
  readonly discriminator = 1
  readonly kind = "U8"
  readonly value: U8Value

  constructor(value: U8Fields) {
    this.value = [value[0]]
  }

  toJSON(): U8JSON {
    return {
      kind: "U8",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      U8: {
        _0: this.value[0],
      },
    }
  }
}

export type U8TupleFields = [number, number]
export type U8TupleValue = [number, number]

export interface U8TupleJSON {
  kind: "U8Tuple"
  value: [number, number]
}

export class U8Tuple {
  static readonly discriminator = 2
  static readonly kind = "U8Tuple"
  readonly discriminator = 2
  readonly kind = "U8Tuple"
  readonly value: U8TupleValue

  constructor(value: U8TupleFields) {
    this.value = [value[0], value[1]]
  }

  toJSON(): U8TupleJSON {
    return {
      kind: "U8Tuple",
      value: [this.value[0], this.value[1]],
    }
  }

  toEncodable() {
    return {
      U8Tuple: {
        _0: this.value[0],
        _1: this.value[1],
      },
    }
  }
}

export type U16Fields = [number]
export type U16Value = [number]

export interface U16JSON {
  kind: "U16"
  value: [number]
}

export class U16 {
  static readonly discriminator = 3
  static readonly kind = "U16"
  readonly discriminator = 3
  readonly kind = "U16"
  readonly value: U16Value

  constructor(value: U16Fields) {
    this.value = [value[0]]
  }

  toJSON(): U16JSON {
    return {
      kind: "U16",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      U16: {
        _0: this.value[0],
      },
    }
  }
}

export type U64Fields = [BN]
export type U64Value = [BN]

export interface U64JSON {
  kind: "U64"
  value: [string]
}

export class U64 {
  static readonly discriminator = 4
  static readonly kind = "U64"
  readonly discriminator = 4
  readonly kind = "U64"
  readonly value: U64Value

  constructor(value: U64Fields) {
    this.value = [value[0]]
  }

  toJSON(): U64JSON {
    return {
      kind: "U64",
      value: [this.value[0].toString()],
    }
  }

  toEncodable() {
    return {
      U64: {
        _0: this.value[0],
      },
    }
  }
}

export type PubkeyFields = [PublicKey]
export type PubkeyValue = [PublicKey]

export interface PubkeyJSON {
  kind: "Pubkey"
  value: [string]
}

export class Pubkey {
  static readonly discriminator = 5
  static readonly kind = "Pubkey"
  readonly discriminator = 5
  readonly kind = "Pubkey"
  readonly value: PubkeyValue

  constructor(value: PubkeyFields) {
    this.value = [value[0]]
  }

  toJSON(): PubkeyJSON {
    return {
      kind: "Pubkey",
      value: [this.value[0].toString()],
    }
  }

  toEncodable() {
    return {
      Pubkey: {
        _0: this.value[0],
      },
    }
  }
}

export type ScopeChainFields = [Array<number>]
export type ScopeChainValue = [Array<number>]

export interface ScopeChainJSON {
  kind: "ScopeChain"
  value: [Array<number>]
}

export class ScopeChain {
  static readonly discriminator = 6
  static readonly kind = "ScopeChain"
  readonly discriminator = 6
  readonly kind = "ScopeChain"
  readonly value: ScopeChainValue

  constructor(value: ScopeChainFields) {
    this.value = [value[0]]
  }

  toJSON(): ScopeChainJSON {
    return {
      kind: "ScopeChain",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      ScopeChain: {
        _0: this.value[0],
      },
    }
  }
}

export type NameFields = [Array<number>]
export type NameValue = [Array<number>]

export interface NameJSON {
  kind: "Name"
  value: [Array<number>]
}

export class Name {
  static readonly discriminator = 7
  static readonly kind = "Name"
  readonly discriminator = 7
  readonly kind = "Name"
  readonly value: NameValue

  constructor(value: NameFields) {
    this.value = [value[0]]
  }

  toJSON(): NameJSON {
    return {
      kind: "Name",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      Name: {
        _0: this.value[0],
      },
    }
  }
}

export type BorrowRateCurveFields = [types.BorrowRateCurveFields]
export type BorrowRateCurveValue = [types.BorrowRateCurve]

export interface BorrowRateCurveJSON {
  kind: "BorrowRateCurve"
  value: [types.BorrowRateCurveJSON]
}

export class BorrowRateCurve {
  static readonly discriminator = 8
  static readonly kind = "BorrowRateCurve"
  readonly discriminator = 8
  readonly kind = "BorrowRateCurve"
  readonly value: BorrowRateCurveValue

  constructor(value: BorrowRateCurveFields) {
    this.value = [new types.BorrowRateCurve({ ...value[0] })]
  }

  toJSON(): BorrowRateCurveJSON {
    return {
      kind: "BorrowRateCurve",
      value: [this.value[0].toJSON()],
    }
  }

  toEncodable() {
    return {
      BorrowRateCurve: {
        _0: types.BorrowRateCurve.toEncodable(this.value[0]),
      },
    }
  }
}

export type FullFields = [types.ReserveConfigFields]
export type FullValue = [types.ReserveConfig]

export interface FullJSON {
  kind: "Full"
  value: [types.ReserveConfigJSON]
}

export class Full {
  static readonly discriminator = 9
  static readonly kind = "Full"
  readonly discriminator = 9
  readonly kind = "Full"
  readonly value: FullValue

  constructor(value: FullFields) {
    this.value = [new types.ReserveConfig({ ...value[0] })]
  }

  toJSON(): FullJSON {
    return {
      kind: "Full",
      value: [this.value[0].toJSON()],
    }
  }

  toEncodable() {
    return {
      Full: {
        _0: types.ReserveConfig.toEncodable(this.value[0]),
      },
    }
  }
}

export type WithdrawalCapFields = [BN, BN]
export type WithdrawalCapValue = [BN, BN]

export interface WithdrawalCapJSON {
  kind: "WithdrawalCap"
  value: [string, string]
}

export class WithdrawalCap {
  static readonly discriminator = 10
  static readonly kind = "WithdrawalCap"
  readonly discriminator = 10
  readonly kind = "WithdrawalCap"
  readonly value: WithdrawalCapValue

  constructor(value: WithdrawalCapFields) {
    this.value = [value[0], value[1]]
  }

  toJSON(): WithdrawalCapJSON {
    return {
      kind: "WithdrawalCap",
      value: [this.value[0].toString(), this.value[1].toString()],
    }
  }

  toEncodable() {
    return {
      WithdrawalCap: {
        _0: this.value[0],
        _1: this.value[1],
      },
    }
  }
}

export type ElevationGroupsFields = [Array<number>]
export type ElevationGroupsValue = [Array<number>]

export interface ElevationGroupsJSON {
  kind: "ElevationGroups"
  value: [Array<number>]
}

export class ElevationGroups {
  static readonly discriminator = 11
  static readonly kind = "ElevationGroups"
  readonly discriminator = 11
  readonly kind = "ElevationGroups"
  readonly value: ElevationGroupsValue

  constructor(value: ElevationGroupsFields) {
    this.value = [value[0]]
  }

  toJSON(): ElevationGroupsJSON {
    return {
      kind: "ElevationGroups",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      ElevationGroups: {
        _0: this.value[0],
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.UpdateReserveConfigValueKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Bool" in obj) {
    const val = obj["Bool"]
    return new Bool([val["_0"]])
  }
  if ("U8" in obj) {
    const val = obj["U8"]
    return new U8([val["_0"]])
  }
  if ("U8Tuple" in obj) {
    const val = obj["U8Tuple"]
    return new U8Tuple([val["_0"], val["_1"]])
  }
  if ("U16" in obj) {
    const val = obj["U16"]
    return new U16([val["_0"]])
  }
  if ("U64" in obj) {
    const val = obj["U64"]
    return new U64([val["_0"]])
  }
  if ("Pubkey" in obj) {
    const val = obj["Pubkey"]
    return new Pubkey([val["_0"]])
  }
  if ("ScopeChain" in obj) {
    const val = obj["ScopeChain"]
    return new ScopeChain([val["_0"]])
  }
  if ("Name" in obj) {
    const val = obj["Name"]
    return new Name([val["_0"]])
  }
  if ("BorrowRateCurve" in obj) {
    const val = obj["BorrowRateCurve"]
    return new BorrowRateCurve([types.BorrowRateCurve.fromDecoded(val["_0"])])
  }
  if ("Full" in obj) {
    const val = obj["Full"]
    return new Full([types.ReserveConfig.fromDecoded(val["_0"])])
  }
  if ("WithdrawalCap" in obj) {
    const val = obj["WithdrawalCap"]
    return new WithdrawalCap([val["_0"], val["_1"]])
  }
  if ("ElevationGroups" in obj) {
    const val = obj["ElevationGroups"]
    return new ElevationGroups([val["_0"]])
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.UpdateReserveConfigValueJSON
): types.UpdateReserveConfigValueKind {
  switch (obj.kind) {
    case "Bool": {
      return new Bool([obj.value[0]])
    }
    case "U8": {
      return new U8([obj.value[0]])
    }
    case "U8Tuple": {
      return new U8Tuple([obj.value[0], obj.value[1]])
    }
    case "U16": {
      return new U16([obj.value[0]])
    }
    case "U64": {
      return new U64([new BN(obj.value[0])])
    }
    case "Pubkey": {
      return new Pubkey([new PublicKey(obj.value[0])])
    }
    case "ScopeChain": {
      return new ScopeChain([obj.value[0]])
    }
    case "Name": {
      return new Name([obj.value[0]])
    }
    case "BorrowRateCurve": {
      return new BorrowRateCurve([types.BorrowRateCurve.fromJSON(obj.value[0])])
    }
    case "Full": {
      return new Full([types.ReserveConfig.fromJSON(obj.value[0])])
    }
    case "WithdrawalCap": {
      return new WithdrawalCap([new BN(obj.value[0]), new BN(obj.value[1])])
    }
    case "ElevationGroups": {
      return new ElevationGroups([obj.value[0]])
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.bool("_0")], "Bool"),
    borsh.struct([borsh.u8("_0")], "U8"),
    borsh.struct([borsh.u8("_0"), borsh.u8("_1")], "U8Tuple"),
    borsh.struct([borsh.u16("_0")], "U16"),
    borsh.struct([borsh.u64("_0")], "U64"),
    borsh.struct([borsh.publicKey("_0")], "Pubkey"),
    borsh.struct([borsh.array(borsh.u16(), 4, "_0")], "ScopeChain"),
    borsh.struct([borsh.array(borsh.u8(), 32, "_0")], "Name"),
    borsh.struct([types.BorrowRateCurve.layout("_0")], "BorrowRateCurve"),
    borsh.struct([types.ReserveConfig.layout("_0")], "Full"),
    borsh.struct([borsh.u64("_0"), borsh.u64("_1")], "WithdrawalCap"),
    borsh.struct([borsh.array(borsh.u8(), 20, "_0")], "ElevationGroups"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
