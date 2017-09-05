var ct = require('cotest')
require('node-dynamic-import')('../module').then(function (Trie) {
	ct('single key', function() {
		var trie = new Trie

		ct('===', trie._leaf, false)
		ct('===', trie.size, 0)
		ct('{===}', trie.keys, [])
		ct('{===}', trie.path, [])

		ct('===', trie.add(), trie)
		ct('===', trie._leaf, true)
		ct('===', trie.size, 1)
		ct('{===}', trie.keys, [])
		ct('{===}', trie.path, [])

		var a = trie.add('/a')
		ct('===', trie.size, 2)
		ct('{===}', trie.keys, ['a'])
		ct('{===}', trie.path, [])
		ct('===', trie.get('/a'), a)

		ct('===', a.size, 1)
		ct('{===}', a.keys, [])
		ct('{===}', a.path, ['a'])

		ct('{===}', trie.all(), [trie])
		ct('===', trie.all('/a').length, 2)
		ct('{===}', trie.all('/a'), [a, trie])
		ct('{===}', trie.all('/b'), [trie])

		ct('===', trie.del(), true)
		ct('===', trie.size, 1)
		ct('===', trie.del('/a'), true)
		ct('===', trie.size, 0)

		ct('===', trie.clear(), undefined)
		ct('===', trie.get(), undefined)
		ct('===', trie.size, 0)
		ct('{===}', trie.keys, [])
		ct('{===}', trie.path, [])
	})

	ct('single wildCard', function() {
		var trie = new Trie,
				a = trie.add('/a'),
				_ = trie.add('/*')
		ct('===', trie.size, 2)
		ct('===', a.size, 1)
		ct('===', _.size, 1)
		ct('===', trie.get('/a'), a)
		ct('{===}', trie.all('/a'), [a, _])
		ct('===', trie.get('/patates'), _)
		ct('{===}', trie.all('/frites'), [_])
	})

	ct('path operations', function() {
		var trie = new Trie

		ct('===', trie.size, 0)
		var _ = trie.add('/*')
		ct('===', trie.size, 1)
		var a = trie.add('/a')
		ct('===', trie.size, 2)
		var __ = trie.add('/*/*')
		ct('===', trie.size, 3)
		var _a = trie.add('/*/a')
		ct('===', trie.size, 4)
		var a_ = trie.add('/a/*')
		ct('===', trie.size, 5)
		var aa = trie.add('/a/a')
		ct('===', trie.size, 6)
		trie.add('/a/a')
		ct('===', trie.size, 6)

		ct('===', trie.get('/a/a'), aa)
		ct('===', trie.get('/x/a'), _a)
		ct('===', trie.get('/a/x'), a_)
		ct('===', trie.get('/x/x'), __)
		ct('===', trie.get('/x'), _)
		ct('===', trie.get('/a'), a)

		//console.log(trie.all('a/a').map(t => t.keys.join('/')).join())
		ct('{===}', trie.all('/a/a'), [aa, a_, a, _a, __, _])
		ct('{===}', trie.all('/a/x'), [a_, a, __, _])
		ct('{===}', trie.all('/a'), [a, _])

		ct('{===}', trie.all('/x/a'), [_a, __, _])
		ct('{===}', trie.all('/x/x'), [__, _])
		ct('{===}', trie.all('/x'), [_])

		ct('===', trie.get(), undefined)
		ct('===', trie.del(), false)
		ct('===', trie.size, 6)
		ct('===', trie.del('/a'), true)
		ct('===', trie.size, 5)
		ct('===', trie.del('/x'), false)
		ct('===', trie.size, 5)
	})
})
