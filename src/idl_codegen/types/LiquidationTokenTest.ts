import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface SolJSON {
  kind: "Sol"
}

export class Sol {
  static readonly discriminator = 0
  static readonly kind = "Sol"
  readonly discriminator = 0
  readonly kind = "Sol"

  toJSON(): SolJSON {
    return {
      kind: "Sol",
    }
  }

  toEncodable() {
    return {
      Sol: {},
    }
  }
}

export interface UsdhJSON {
  kind: "Usdh"
}

export class Usdh {
  static readonly discriminator = 1
  static readonly kind = "Usdh"
  readonly discriminator = 1
  readonly kind = "Usdh"

  toJSON(): UsdhJSON {
    return {
      kind: "Usdh",
    }
  }

  toEncodable() {
    return {
      Usdh: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.LiquidationTokenTestKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Sol" in obj) {
    return new Sol()
  }
  if ("Usdh" in obj) {
    return new Usdh()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.LiquidationTokenTestJSON
): types.LiquidationTokenTestKind {
  switch (obj.kind) {
    case "Sol": {
      return new Sol()
    }
    case "Usdh": {
      return new Usdh()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Sol"),
    borsh.struct([], "Usdh"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
