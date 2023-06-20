import type { Link } from 'multiformats/interface'

declare class LinkMap<Key extends Link, Value> extends Map<Key, Value> {}

export { LinkMap as Map }
