import test, { expect } from '@playwright/test'
import * as bin from '../../server/binaryService'

test('bin utils can transform between nodejs Buffer and uint8array', () => {
  const u = Uint8Array.from([0, 1, 2])
  expect(bin.bufferToUint8Array(bin.uint8ArrayToBuffer(u))).toEqual(u)
})

test('uuid gens uuid', () => {
  expect(bin.uuid()).toBeTruthy()
})
