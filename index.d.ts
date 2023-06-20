import type { Link, Version } from 'multiformats/interface'

declare class LinkMap<Key extends Link<unknown, number, number, Version>, Value> extends Map<Key, Value> {}

export { LinkMap as Map }
