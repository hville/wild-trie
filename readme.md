# wild-trie

*small and flexible trie with wildcards*

## Examples

```javascript
import WildTrie from 'wild-trie'

var trie = new WildTrie({
  //path: any function that returns an array of keys of any type
  path: function(pointer) { return pointer.split('/').slice(1) },
  //wild: any value to use as wildcard (strict equality ===)
  wild: '*'
})

var _a = trie.add('/*/a'),
    a_ = trie.add('/a/*'),
    aa = trie.add('/a/a')

console.assert(trie.size, 3)
console.assert(trie.get('/a/a'), aa)
console.assert(trie.get('/z/a'), _a)
console.assert(trie.get('/a/z'), a_)
console.assert(trie.get('/z/z'), undefined)

console.assert(trie.all('/a/a'), [aa, a_, _a])
console.assert(trie.all('/z/a'), [a_])
console.assert(trie.all('/z/z'), [])
```


## Features, Limitations, Gotcha

* available in CommonJS and ES6 modules
  * CJS: `var WildTrie = require('wild-trie')`
  * ES modules: `import WildTrie from 'wild-trie'`

* only the last item of an Array can be deleted to avoid shifting of keys
* No Array splicing to keep the keys unchanged. additions and removals from the end only (eg. push pop)
* only JSON types supported (Array, Object, string, number, boolean, null)
* set triggers a deletion if the value is undefined and/or absent


## API

new WildTrie(options=defaults): `Trie`
* .path: `Array` - the chain of keys to the leaf
* .keys: `Array` - the list of child keys
* .size: `number` - the number of entries in the trie
* .add(path:`any`): `Trie`
* .get(path:`any`): `Trie`
* .all(path:`any`): `Array<Trie>`
* .del(path:`any`): `boolean`
* .clear(): `undefined`


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
