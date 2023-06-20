# lnmap

[![Build](https://github.com/alanshaw/lnmap/actions/workflows/build.yml/badge.svg)](https://github.com/alanshaw/lnmap/actions/workflows/build.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Typed Map of IPLD links (CIDs) and values.

## Install

```sh
npm i lnmap
```

## Usage

```js
import { Map } from 'lnmap'
import { sha256 } from 'multiformats/hashes/sha2'
import * as raw from 'multiformats/codecs/raw'
import { CID } from 'multiformats/cid'

const key = CID.create(1, raw.code, sha256.digest(new Uint8Array()))
const value = 'any data'

const map = new Map()
map.set(key, value)

console.log(map.get(key)) // prints: "any data"
```

## Contributing

Feel free to join in. All welcome. Please [open an issue](https://github.com/alanshaw/lnmap/issues)!

## License

Dual-licensed under [MIT + Apache 2.0](https://github.com/alanshaw/lnmap/blob/main/LICENSE.md)
