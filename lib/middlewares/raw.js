export function raw (handler) {
	return function ({ request, response }, next) {
		return handler(request.raw, response.raw, next);
	}
}
