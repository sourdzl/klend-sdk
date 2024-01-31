import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface RefreshReserveJSON {
  kind: "RefreshReserve"
}

export class RefreshReserve {
  static readonly discriminator = 0
  static readonly kind = "RefreshReserve"
  readonly discriminator = 0
  readonly kind = "RefreshReserve"

  toJSON(): RefreshReserveJSON {
    return {
      kind: "RefreshReserve",
    }
  }

  toEncodable() {
    return {
      RefreshReserve: {},
    }
  }
}

export interface RefreshFarmsForObligationForReserveJSON {
  kind: "RefreshFarmsForObligationForReserve"
}

export class RefreshFarmsForObligationForReserve {
  static readonly discriminator = 1
  static readonly kind = "RefreshFarmsForObligationForReserve"
  readonly discriminator = 1
  readonly kind = "RefreshFarmsForObligationForReserve"

  toJSON(): RefreshFarmsForObligationForReserveJSON {
    return {
      kind: "RefreshFarmsForObligationForReserve",
    }
  }

  toEncodable() {
    return {
      RefreshFarmsForObligationForReserve: {},
    }
  }
}

export interface RefreshObligationJSON {
  kind: "RefreshObligation"
}

export class RefreshObligation {
  static readonly discriminator = 2
  static readonly kind = "RefreshObligation"
  readonly discriminator = 2
  readonly kind = "RefreshObligation"

  toJSON(): RefreshObligationJSON {
    return {
      kind: "RefreshObligation",
    }
  }

  toEncodable() {
    return {
      RefreshObligation: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RequiredIxTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("RefreshReserve" in obj) {
    return new RefreshReserve()
  }
  if ("RefreshFarmsForObligationForReserve" in obj) {
    return new RefreshFarmsForObligationForReserve()
  }
  if ("RefreshObligation" in obj) {
    return new RefreshObligation()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RequiredIxTypeJSON
): types.RequiredIxTypeKind {
  switch (obj.kind) {
    case "RefreshReserve": {
      return new RefreshReserve()
    }
    case "RefreshFarmsForObligationForReserve": {
      return new RefreshFarmsForObligationForReserve()
    }
    case "RefreshObligation": {
      return new RefreshObligation()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "RefreshReserve"),
    borsh.struct([], "RefreshFarmsForObligationForReserve"),
    borsh.struct([], "RefreshObligation"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
