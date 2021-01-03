/** @typedef {import('../application/Application').NextHandler} NextHandler */

let JSON_TYPES = new Set(['application/json']);

/**
 * @returns {NextHandler}
 */
export function bodyParser () {
	let jsonHandler = json();

	return function bodyParserHandler (ctx, next) {
		let { rawBody, type } = ctx.request;

		if (!rawBody) return next();

		if (JSON_TYPES.has(type)) {
			return jsonHandler(ctx, next);
		}

		return next();
	}
}

/**
 * @returns {NextHandler}
 */
export function json () {
	return function jsonHandler ({ request, response }, next) {
		if (!request.rawBody || !JSON_TYPES.has(request.type)) return next();

		try {
			request.body = JSON.parse(request.rawBody.toString());
			return next();
		} catch (err) {
			response.throw(400, err.message);
		}
	}
}
