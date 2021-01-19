import { ok as assert } from 'assert';
import { compose } from '@intrnl/srv';
import { compile } from '@intrnl/path-builder';

import type { NextHandler } from '@intrnl/srv';


export class Router {
	middlewares: NextHandler[] = [];
	handler = compose(this.middlewares);

	mount (path: string, ...handlers: NextHandler[]): this {
		assert(typeof path == 'string', 'path must be a string');
		assert(handlers.every((h) => typeof h == 'function'), 'handler must be a function');

		path = normalize(path);

		let pattern = compile(path, true);
		let dispatch = compose(handlers);

		let handler: NextHandler = (context, next) => {
			let { request } = context;

			let match = pattern.exec(request.url.path);
			if (!match) return next();

			let prevHref = request.url.href;
			let prevPath = request.url.path;
			let prevParams = request.params;

			request.url.href = '/' + request.url.search;
			request.url.path = '/';
			request.params = match.groups || {};

			return dispatch(context)
				.finally(() => {
					request.url.href = prevHref;
					request.url.path = prevPath;
					request.params = prevParams;
				})
				.then(next);
		};

		this.middlewares.push(handler);
		return this;
	}

	route (method: string, path: string, ...handlers: NextHandler[]): this {
		assert(typeof path == 'string', 'path must be a string');
		assert(handlers.every((h) => typeof h == 'function'), 'handler must be a function');

		method = method.toUpperCase();
		path = normalize(path);

		let isHEAD = method == 'HEAD';

		let pattern = compile(path);
		let dispatch = compose(handlers);

		let handler: NextHandler = (context, next) => {
			let { request } = context;

			if (!(method == request.method || (isHEAD && request.method == 'GET'))) return next();

			let match = pattern.exec(path);
			if (!match) return next();

			let prevParams = request.params;
			request.params = match.groups || {};

			return dispatch(context)
				.finally(() => {
					request.params = prevParams
				})
				.then(next);
		};

		this.middlewares.push(handler);
		return this;
	}
}

function normalize (path: string) {
	return (path[0] != '/' ? '/' + path : path).replace(/\/$/, '');
}
