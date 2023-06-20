import { base58btc } from 'multiformats/bases/base58'

/** @type {WeakMap<import('multiformats').MultihashDigest, string>} */
const cache = new WeakMap()

/** @param {import('multiformats').MultihashDigest} digest */
const toBase58String = digest => {
  let str = cache.get(digest)
  if (!str) {
    str = base58btc.encode(digest.bytes)
    cache.set(digest, str)
  }
  return str
}

/**
 * @template {import('multiformats').Link<unknown, number, number, import('multiformats').Version>} Key
 * @template Value
 * @implements {Map<Key, Value>}
 */
class LinkMap extends Map {
  /** @type {Map<string, Key>} */
  #keys

  /**
   * @param {Array<[Key, Value]>} [entries]
   */
  constructor (entries) {
    super()
    this.#keys = new Map()
    for (const [k, v] of entries ?? []) {
      this.set(k, v)
    }
  }

  clear () {
    super.clear()
    this.#keys.clear()
  }

  /**
   * @param {Key} key
   * @returns {boolean} true if an element in the Map existed and has been
   * removed, or false if the element does not exist.
   */
  delete (key) {
    const mhstr = toBase58String(key.multihash)
    super.delete(mhstr)
    return this.#keys.delete(mhstr)
  }

  /**
   * Executes a provided function once per each key/value pair in the Map, in
   * insertion order.
   * @param {(value: Value, key: Key, map: Map<Key, Value>) => void} callbackfn
   * @param {any} [thisArg]
   */
  forEach (callbackfn, thisArg) {
    super.forEach((v, k) => {
      const key = this.#keys.get(k)
      /* c8 ignore next line */
      if (!key) throw new Error('internal inconsistency')
      callbackfn.call(thisArg, v, key, this)
    })
  }

  /**
   * Returns a specified element from the Map object. If the value that is
   * associated to the provided key is an object, then you will get a reference
   * to that object and any change made to that object will effectively modify
   * it inside the Map.
   * @param {Key} key
   * @returns {Value|undefined} Returns the element associated with the
   * specified key. If no element is associated with the specified key,
   * undefined is returned.
   */
  get (key) {
    return super.get(toBase58String(key.multihash))
  }

  /**
   * @param {Key} key
   * @returns {boolean} Whether an element with the specified key exists or not.
   */
  has (key) {
    return super.has(toBase58String(key.multihash))
  }

  /**
   * Adds a new element with a specified key and value to the Map. If an
   * element with the same key already exists, the element will be updated.
   *
   * @param {Key} key
   * @param {Value} value
   */
  set (key, value) {
    const mhstr = toBase58String(key.multihash)
    this.#keys.set(mhstr, key)
    return super.set(mhstr, value)
  }

  /**
   * @returns {number} The number of elements in the Map.
   */
  get size () {
    return super.size
  }

  /** @returns An iterable of entries in the map. */
  [Symbol.iterator] () {
    return this.entries()
  }

  /**
   * @returns {IterableIterator<[Key, Value]>} An iterable of key, value pairs for every entry in the map.
   */
  * entries () {
    for (const [k, v] of super.entries()) {
      const key = this.#keys.get(k)
      /* c8 ignore next line */
      if (!key) throw new Error('internal inconsistency')
      yield [key, v]
    }
  }

  /**
   * @returns {IterableIterator<Key>} An iterable of keys in the map
   */
  keys () {
    return this.#keys.values()
  }

  /**
   * @returns {IterableIterator<Value>} An iterable of values in the map
   */
  values () {
    return super.values()
  }
}

export { LinkMap as Map }
