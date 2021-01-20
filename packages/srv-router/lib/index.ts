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

		let length = path.length;
		let dispatch = compose(handlers);

		let handler: NextHandler = async (context, next) => {
			let { request } = context;

			let prevPath = request.url.path;
			let prevHref = request.url.href;

			if (!(prevPath == path || prevPath.startsWith(path + '/'))) return next();

			let nextPath = prevPath.slice(length) || '/';
			let nextHref = nextPath + request.url.search;

			request.url.path = nextPath;
			request.url.href = nextHref;

			await dispatch(context, async () => {
				request.url.path = prevPath;
				request.url.href = prevHref;
				await next();
				request.url.path = nextPath;
				request.url.href = nextHref;
			});

			request.url.path = prevPath;
			request.url.href = prevHref;
		};

		this.middlewares.push(handler);
		return this;
	}

	route (method: string | false, path: string, ...handlers: NextHandler[]): this {
		assert(method == false || typeof method == 'string', 'method must be a string or false');
		assert(typeof path == 'string', 'path must be a string');
		assert(handlers.every((h) => typeof h == 'function'), 'handler must be a function');

		if (method) method = method.toUpperCase();
		path = normalize(path);

		let isHEAD = method == 'HEAD';

		let pattern = compile(path);
		let dispatch = compose(handlers);

		let handler: NextHandler = async (context, next) => {
			let { request } = context;

			if (method && !(
				(method == request.method) ||
				(isHEAD && request.method == 'GET')
			)) return next();

			let match = pattern.exec(request.url.path);
			if (!match) return next();

			let prevParams = request.params;
			let nextParams = match.groups || {};

			request.params = nextParams;

			await dispatch(context, async () => {
				request.params = prevParams;
				await next();
				request.params = nextParams;
			});

			request.params = prevParams;
		};

		this.middlewares.push(handler);
		return this;
	}
}

function normalize (path: string) {
	return (path[0] != '/' ? '/' + path : path).replace(/\/$/, '');
}
