import { parse } from '../internal/regexparam.js';


/**
 * @typedef {object} Route
 * @property {string[]} keys
 * @property {RegExp} pattern
 * @property {string | undefined} method
 * @property {function[]} handlers
 */

/**
 * @typedef {object} RouteMatch
 * @property {object} params
 * @property {function[]} handlers
 */

export class Router {
	/** @type {Route[]} */
	routes = [];

	/**
	 * Adds a middleware
	 * @param {string} path
	 * @param  {...function} handlers
	 */
	mount (path, ...handlers) {
		let { keys, pattern } = parse(path, true);
		this.routes.push({ keys, pattern, handlers });
	}

	/**
	 * Adds a route
	 * @param {string} method
	 * @param {string} path
	 * @param  {...function} handlers
	 */
	route (method, path, ...handlers) {
		method = method.toUpperCase();
		let { keys, pattern } = parse(path, false);
		this.routes.push({ keys, pattern, method, handlers });
	}

	/**
	 * Finds matching handlers of a given method and path
	 * @param {string} method
	 * @param {string} path
	 * @returns {RouteMatch}
	 */
	match (method, path) {
		method = method.toUpperCase();
		let isHEAD = method == 'HEAD';
		let handlers = [];
		let params = {};

		for (let route of this.routes) {
			if (!route.method || route.method == method || isHEAD && route.method == 'GET') {
				if (route.keys.length) {
					let matches = route.pattern.exec(path);
					if (!matches) continue;

					for (let i = 0; i < route.keys.length; i++) {
						params[route.keys[i]] = matches[i + 1];
					}
				} else if (!route.pattern.test(path)) {
					continue;
				}

				handlers = handlers.concat(route.handlers);
			}
		}

		return { params, handlers };
	}
}
