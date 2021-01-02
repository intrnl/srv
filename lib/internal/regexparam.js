/// taken from regexparam
/// licensed under the MIT license
/// https://github.com/lukeed/regexparam

/**
 * @typedef {object} RoutePattern
 * @property {string[]} keys
 * @property {RegExp} pattern
 */

/**
 * Converts route patterns into regular expressions
 * @param {string} str
 * @param {boolean} loose
 */
export function parse (str, loose = false) {
	let parts = str.split('/');
	let keys = [];
	let pattern = '';

	if (!parts[0]) parts.shift();

	for (let part; (part = parts.shift());) {
		let first = part[0];

		if (first == '*') {
			keys.push('*');
			pattern += '/(.*)'
		} else if (first == ':') {
			let opt = part.indexOf('?', 1);
			let ext = part.indexOf('.', 1);

			keys.push(part.slice(1, !!~opt ? opt : !!~ext ? ext : part.length));

			pattern += (!!~opt && !~ext) ? '(?:/([^/]+?))?' : '/([^/]+?)';
			if (!!~ext) pattern += (!!~opt ? '?' : '') + '\\' + part.slice(ext);
		} else {
			pattern += '/' + part;
		}
	}

	return {
		keys,
		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i'),
	};
}
