import { v4 as uuidv4 } from 'uuid'

export const Utility = {
  uint8ArrayToBuffer(u: Uint8Array): Buffer {
    return Buffer.from(u)
  },
  bufferToUint8Array(buf: Buffer): Uint8Array {
    return new Uint8Array(buf)
  },
  uuid(): string {
    return uuidv4()
  },
}
