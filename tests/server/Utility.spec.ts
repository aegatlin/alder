import test, { expect } from '@playwright/test'
import { Utility } from '../../server/namespaces/Utility'

test('bin utils can transform between nodejs Buffer and uint8array', () => {
  const u = Uint8Array.from([0, 1, 2])
  expect(Utility.bufferToUint8Array(Utility.uint8ArrayToBuffer(u))).toEqual(u)
})

test('uuid gens uuid', () => {
  expect(Utility.uuid()).toBeTruthy()
})
