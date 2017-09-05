/* hugov@runbox.com | https://github.com/hville/wild-trie.git | license:MIT */
var wildTrie = (function () {
'use strict';

// @ts-check

function getPath(ptr) {
	var p = [];
	if (ptr == null) return p
	if (ptr[0] !== '/') throw Error('invalid path: ' + ptr)
	for (var i=0, j=-1; i<ptr.length; ++i) ptr[i] !== '/' ? p[j] += ptr[i] : p[++j] = '';
	return p
}

function getOptions(cfg) {
	return {
		path: cfg.path || getPath,
		wild: 'wild' in cfg ? cfg.wild : '*'
	}
}

/**
 * @constructor
 * @param {Object} [options]
 * @param {Array} [pathKeys]
 */
function Trie(options, pathKeys) {
	this._kids = new Map;
	this._leaf = false;
	this._path = pathKeys || [];
	this._opts = (pathKeys && pathKeys.length) ? options : getOptions(options || {});
}

Trie.prototype = {
	//@ts-ignore
	constructor: Trie,

	/**
	 * @return {number}
	 */
	get size() {
		return trieSize.call([0], this)
	},

	/**
	 * @return {Array}
	 */
	get keys() {
		var keys = [];
		this._kids.forEach(pushKey, keys);
		return keys
	},

	/**
	 * @return {Array}
	 */
	get path() {
		return this._path.slice()
	},

	/**
	 * @param {*} path
	 * @return {Trie}
	 */
	get: function(path) {
		var keys = this._opts.path(path);
		/**@type {Trie} */
		var kin = this,
				kid = kin,
				tri = kin._leaf ? kin : undefined;
		for (var i=0; i<keys.length; ++i) {
			if (!(kid = kin._kids.get(keys[i]) || kin._kids.get(kin._opts.wild))) break
			if (kid._leaf) tri = kid;
			kin = kid;
		}
		return tri
	},

	/**
	 * @param {*} path
	 * @return {!Array<Trie>}
	 */
	all: function(path) {
		return getAll(this, this._opts.path(path), [])
	},

	/**
	 * @param {*} path
	 * @return {Trie}
	 */
	add: function(path) {
		var keys = this._opts.path(path);
		/**@type {Trie} */
		var tri = this,
				kid = null;
		for (var i=0; i<keys.length; ++i) {
			kid = tri._kids.get(keys[i]);
			if (!kid) tri._kids.set(keys[i], kid = new Trie(this._opts, keys.slice(0,i+1)));
			tri = kid;
		}
		tri._leaf = true;
		return tri
	},

	/**
	 * @return {void}
	 */
	clear: function() {
		this._kids.clear();
		this._leaf = false;
	},

	/**
	 * @param {*} path
	 * @return {boolean}
	 */
	del: function(path) {
		return delLeaf(this, this._opts.path(path))
	}
};

/**
 * @param {Trie} tri
 * @return {Array<number>}
 */
function trieSize(tri) {
	if (tri._leaf) ++this[0];
	tri._kids.forEach(trieSize, this);
	return this[0]
}

/**
 * @param {Trie} tri
 * @param {Array<string>} keys
 * @param {Array<Trie>} all
 * @return {Array<Trie>}
 */
function getAll(tri, keys, all) {
	if (tri) {
		if (tri._path.length < keys.length) {
			getAll(tri._kids.get(keys[tri._path.length]), keys, all);
			getAll(tri._kids.get(tri._opts.wild), keys, all);
		}
		if (tri._leaf) all.push(tri);
	}
	return all
}

/**
 * @param {Trie} tri
 * @param {Array} keys
 * @param {number} idx
 * @return {boolean}
 */
function delLeaf(tri, keys) {
	if (keys.length === tri._path.length) return tri._leaf && !(tri._leaf = false)
	var key = keys[tri._path.length],
			kid = tri._kids.get(key);
	if (!kid) return false
	var res = delLeaf(kid, keys);
	return (!kid._leaf && !kid._kids.size && tri._kids.delete(key)) || res
}

function pushKey(v,k) {
	this.push(k);
}

return Trie;

}());
