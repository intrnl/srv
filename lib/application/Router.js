import { ok as assert } from 'assert';
import { parse } from '../internal/regexparam.js';


/**
 * @typedef {object} Route
 * @property {string[]} keys
 * @property {RegExp} pattern
 * @property {?string} method
 * @property {function[]} handlers
 */

/**
 * @typedef {object} RouteMatch
 * @property {object} params
 * @property {function} handler
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
		assert(typeof path == 'string', 'path must be a string');
		assert(handlers.every((handler) => typeof handler == 'function'), 'handlers must be an array of function');

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
		assert(typeof method == 'string', 'method must be a string');
		assert(typeof path == 'string', 'path must be a string');
		assert(handlers.every((handler) => typeof handler == 'function'), 'handlers must be an array of function');

		method = method.toUpperCase();
		let { keys, pattern } = parse(path, false);
		this.routes.push({ keys, pattern, method, handlers });
	}

	/**
	 * Finds matching handlers of a given method and path
	 * @param {string} method
	 * @param {string} path
	 * @returns {RouteMatch[]}
	 */
	match (method, path) {
		assert(typeof method == 'string', 'method must be a string');
		assert(typeof path == 'string', 'path must be a string');

		method = method.toUpperCase();
		let isHEAD = method == 'HEAD';
		let routes = [];

		for (let route of this.routes) {
			if (!route.method || route.method == method || isHEAD && route.method == 'GET') {
				let { pattern, keys, handlers } = route;

				let params = {};

				if (keys.length) {
					let matches = pattern.exec(path);
					if (!matches) continue;

					for (let i = 0; i < keys.length; i++) {
						params[keys[i]] = matches[i + 1];
					}
				} else if (!pattern.test(path)) {
					continue;
				}

				for (let handler of handlers) {
					routes.push({ handler, params });
				}
			}
		}

		return routes;
	}
}
