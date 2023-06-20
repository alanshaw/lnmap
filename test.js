import { sha256 } from 'multiformats/hashes/sha2'
import * as raw from 'multiformats/codecs/raw'
import * as Link from 'multiformats/link'
import { fromString, equals } from 'multiformats/bytes'
import { Map } from './index.js'

/** @param {Uint8Array} bytes */
const createRawLink = bytes => {
  const digest = sha256.digest(bytes)
  // @ts-expect-error
  return Link.create(raw.code, digest)
}

/** @type {Record<string, import('entail').Test>} */
export const test = {
  'should set and get a value': assert => {
    const value = fromString('get + set')
    const key = createRawLink(value)
    const map = new Map()
    assert.ok(!map.get(key))
    map.set(key, value)
    // access with new CID to ensure different instances retrieve same value
    assert.deepEqual(map.get(createRawLink(value)), value)
  },

  'should instance from entries': assert => {
    const value = fromString('from ents')
    const key = createRawLink(value)
    const map = new Map([[key, value]])
    // @ts-expect-error
    assert.deepEqual(map.get(key), value)
  },

  'should delete a value': assert => {
    const value = fromString('delete a value')
    const key = createRawLink(value)
    const map = new Map([[key, value]])
    assert.ok(map.has(key))
    assert.ok(map.delete(key))
    assert.ok(!map.has(key))
    assert.ok(!map.get(key))
  },

  'should clear all': assert => {
    /** @type {Array<[import('multiformats').Link, Uint8Array]>} */
    const entries = [
      fromString('clear all teh things!'),
      fromString('everything'),
      fromString('all gone')
    ].map(v => [createRawLink(v), v])
    const map = new Map(entries)
    assert.equal(map.size, entries.length)
    map.clear()
    assert.equal(map.size, 0)
    for (const [k] of entries) {
      // @ts-expect-error
      assert.equal(map.get(k), undefined)
    }
  },

  'should iterate with forEach()': assert => {
    /** @type {Array<[import('multiformats').Link, Uint8Array]>} */
    const entries = [
      fromString('for each'),
      fromString('thing'),
      fromString('here')
    ].map(v => [createRawLink(v), v])
    const map = new Map(entries)
    const thisArg = {}
    let count = 0
    map.forEach(function (v, k, m) {
      count++
      assert.strictEqual(this, thisArg)
      assert.strictEqual(m, map)
      const entry = entries.find(e => e[0].toString() === k.toString())
      assert.ok(entry)
      // @ts-expect-error
      assert.deepEqual(v, entry[1])
    }, thisArg)
    assert.equal(count, entries.length)
  },

  'should iterate with Symbol.iterator()': assert => {
    /** @type {Array<[import('multiformats').Link, Uint8Array]>} */
    const entries = [
      fromString('Symbol.iterator'),
      fromString('iterable'),
      fromString('thingers')
    ].map(v => [createRawLink(v), v])
    const map = new Map(entries)
    for (const [k, v] of map) {
      const entry = entries.find(e => e[0].toString() === k.toString())
      assert.ok(entry)
      // @ts-expect-error
      assert.deepEqual(v, entry[1])
    }
    assert.equal([...map].length, entries.length)
  },

  'should iterate with entries()': assert => {
    /** @type {Array<[import('multiformats').Link, Uint8Array]>} */
    const entries = [
      fromString('dot entries'),
      fromString('does iterate'),
      fromString('the entries')
    ].map(v => [createRawLink(v), v])
    const map = new Map(entries)
    for (const [k, v] of map.entries()) {
      const entry = entries.find(e => e[0].toString() === k.toString())
      assert.ok(entry)
      // @ts-expect-error
      assert.deepEqual(v, entry[1])
    }
    assert.equal([...map.entries()].length, entries.length)
  },

  'should iterate keys': assert => {
    /** @type {Array<[import('multiformats').Link, Uint8Array]>} */
    const entries = [
      fromString('key'),
      fromString('iteration'),
      fromString('is the best')
    ].map(v => [createRawLink(v), v])
    const map = new Map(entries)
    for (const k of map.keys()) {
      assert.ok(entries.some(e => e[0].toString() === k.toString()))
    }
    assert.equal([...map.keys()].length, entries.length)
  },

  'should iterate values': assert => {
    /** @type {Array<[import('multiformats').Link, Uint8Array]>} */
    const entries = [
      fromString('value'),
      fromString('iterations'),
      fromString('are the best')
    ].map(v => [createRawLink(v), v])
    const map = new Map(entries)
    for (const v of map.values()) {
      assert.ok(entries.some(e => equals(e[1], v)))
    }
    assert.equal([...map.values()].length, entries.length)
  }
}
