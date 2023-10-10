# romanize-japanese

romanize-japanese is a Node.js ES Module port of `hepburn` package. It's used to convert Hiragana/Katakana to Roman (or vice versa).

visit the [original repository](https://github.com/lovell/hepburn) for more information about `hepburn`.

This module also add a beautify parameter to the `fromKana` hepburn function :

```javascript
// classic
hepburn.fromKana('きょう') // outputs "KYOU"
// beautified
hepburn.fromKana('きょう', true) // outputs "kyo u"
```

## installation

```bash
yarn add romanize-japanese
```

## Usage

### on a webpage

```html
<script type=module>
  import {fromKana} from '/node_modules/romanize-japanese/build/romanize-japanese.mjs'
  console.log(fromKana('みみ', true)) // outputs "mi mi"
</script>
```
*(note: `node_modules` needs to be publicly accessible from the client)*

### in a node es module

```javascript
import romanize from 'romanize-japanese'

console.log(romanize.fromKana('みみ', true)) // outputs "mi mi"
```

### or CommonJS script
```javascript
console.log(require('romanize-japanese').fromKana('みみ', true))
```

## In command line

```bash
$ yarn global add romanize-japanese
$ romanize-japanese みみ
mi mi
$
```

## Known limitations

This module will only convert hiragana/katakana literals to roman but will not convert any Kanji characters.

## Build (browser version)

- clone this repository
- `yarn install` to install the default dependencies (in `package.json`)
  - (but for instance) if you want to build another version of `hepburn` use `yarn add hepburn@<version>`
- then run `yarn build`
- now `build/romanize-japanese.mjs` will contain the `hepburn` es module for browsers