import type { NextHandler } from '@intrnl/srv';


let JSON_TYPES = new Set([
	'application/json',
	'application/json-patch+json',
	'application/vnd.api+json',
	'application/csp-report',
]);

export function json (): NextHandler {
	return function jsonHandler ({ request, response }, next) {
		if (!request.rawBody || JSON_TYPES.has(request.type!)) return next();

		try {
			request.body = JSON.parse(request.rawBody.toString());
			return next();
		} catch (err) {
			response.throw(400, err.message);
		}
	}
}
