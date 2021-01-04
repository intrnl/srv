import type { NextHandler } from '../application/Application';


export function bodyParser (): NextHandler {
	let jsonHandler = json();

	return function bodyParserHandler (ctx, next) {
		let { request } = ctx;
		if (!request.rawBody) return next();

		if (request.type == 'application/json') {
			return jsonHandler(ctx, next);
		}

		return next();
	}
}

export function json (): NextHandler {
	return function jsonHandler ({ request, response }, next) {
		if (!request.rawBody || request.type != 'application/json') return next();

		try {
			request.body = JSON.parse(request.rawBody.toString());
			return next();
		} catch (err) {
			response.throw(400, err.message);
		}
	}
}
