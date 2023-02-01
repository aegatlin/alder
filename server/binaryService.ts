import { v4 as uuidv4 } from 'uuid'

export function uint8ArrayToBuffer(u: Uint8Array): Buffer {
  return Buffer.from(u)
}

export function bufferToUint8Array(buf: Buffer): Uint8Array {
  return new Uint8Array(buf)
}

export function uuid(): string {
  return uuidv4()
}
