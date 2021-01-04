import { ok as assert } from 'assert';
import { parse } from '../internal/regexparam';
import { compose } from '../internal/compose-middlewares';
import { lead } from '../internal/utils';
import type { NextHandler } from './Application';


export class Router {
	middlewares: NextHandler[] = [];
	handler = compose(this.middlewares);

	/**
	 * Mounts a middleware, this is the same as passing false on the method
	 * parameter of the route method
	 */
	mount (path: string, ...handlers: NextHandler[]): this {
		return this.route(false, path, ...handlers);
	}

	/**
	 * Adds a route
	 */
	route (method: false | string, path: string, ...handlers: NextHandler[]): this {
		assert((method && typeof method == 'string') || method == false, 'method must be either false or a string');
		assert(path && typeof path == 'string', 'path must be a string');
		assert(handlers.every((h) => typeof h == 'function'), 'handler must be a function');

		if (typeof method == 'string') method = method.toUpperCase();
		path = lead(path);

		let len = path.length;
		let global = !method;
		let isHEAD = method == 'HEAD';

		let { keys, pattern } = parse(path, global);
		let dispatch = compose(handlers);

		let handler: NextHandler = (context, next) => {
			let { request } = context;

			if (!method || method == request.method || (isHEAD && request.method == 'GET')) {
				let nextParams: Record<string, string> = {};

				if (keys.length) {
					let matches = pattern.exec(request.url.path);
					if (!matches) return next();

					for (let i = 0; i < keys.length; i++) {
						nextParams[keys[i]] = matches[i + 1];
					}
				} else if (!pattern.test(request.url.path)) {
					return next();
				}

				if (global) {
					let prevHref = request.url.href;
					let prevPath = request.url.path;
					let prevParams = request.params;

					let nextHref = prevHref.slice(len) || '/';
					let nextPath = prevHref.slice(len) || '/';

					request.params = nextParams;
					request.url.href = nextHref;
					request.url.path = nextPath;

					return dispatch(context)
						.finally(() => {
							request.params = prevParams;
							request.url.href = prevHref;
							request.url.path = prevPath;
						})
						.then(next);
				} else {
					request.params = nextParams;
					return dispatch(context, next);
				}
			}

			return next();
		};

		this.middlewares.push(handler);
		return this;
	}
}
