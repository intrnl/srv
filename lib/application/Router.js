import { ok as assert } from 'assert';
import { parse } from '../internal/regexparam.js';
import { compose } from '../internal/compose-middlewares.js';
import { lead } from '../internal/utils.js';

/** @typedef {import('./Application').Context} Context */
/** @typedef {import('./Application').NextHandler} NextHandler */
/** @typedef {import('./Application').Dispatcher} Dispatcher */


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
	/** @type {NextHandler[]} */
	middlewares = [];
	/** @type {Dispatcher} */
	dispatch = compose(this.middlewares);
	/** @type {NextHandler} */
	handler = this.handler.bind(this);

	/**
	 * Middleware handler
	 * @param {Context} context
	 * @param {function} next
	 * @returns {Promise<void>}
	 */
	handler (context, next) {
		return this.dispatch(context, next);
	}

	/**
	 * Mounts a middleware, this is the same as passing false on router.route()
	 * method parameter
	 * @param {string} path
	 * @param  {...NextHandler} middlewares
	 */
	mount (path, ...middlewares) {
		return this.route(false, path, ...middlewares);
	}

	/**
	 * Adds a route
	 * @param {string} method
	 * @param {string} path
	 * @param  {...NextHandler} middlewares
	 */
	route (method, path, ...middlewares) {
		assert((method && typeof method == 'string') || method == false, 'method must be a string or false for global');
		assert(path && typeof path == 'string', 'path must be a string');
		assert(middlewares.every((m) => typeof m == 'function'), 'middleware must be a function');

		if (typeof method == 'string') method = method.toUpperCase();
		path = lead(path);

		let pathLen = path.length;
		let global = !method;
		let isHEAD = method == 'HEAD';

		let { keys, pattern } = parse(path, global);
		let dispatch = compose(middlewares);

		/** @type {NextHandler} */
		function handler (context, next) {
			let { request } = context;

			if (!method || method == request.method || (isHEAD && request.method == 'GET')) {
				let prevHref = request.url.href;
				let prevPath = request.url.path;
				let prevParams = request.params;

				let nextParams = {};

				if (keys.length) {
					let matches = pattern.exec(prevPath);
					if (!matches) return next();

					for (let i = 0; i < keys.length; i++) {
						nextParams[keys[i]] = matches[i + 1];
					}
				} else if (!pattern.test(prevPath)) {
					return next();
				}

				let nextHref = global ? prevHref.slice(pathLen) || '/' : prevHref;
				let nextPath = global ? prevPath.slice(pathLen) || '/' : prevPath;

				try {
					request.params = nextParams;
					request.url.href = nextHref;
					request.url.path = nextPath;
					return dispatch(context, next);
				} finally {
					request.params = prevParams;
					request.url.href = prevHref;
					request.url.path = prevPath;
				}
			}

			return next();
		}

		this.middlewares.push(handler);
		return this;
	}
}
