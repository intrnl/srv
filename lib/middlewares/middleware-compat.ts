import type { IncomingMessage, ServerResponse } from 'http';
import type { NextHandler } from '../application/Application';
import type { Promisable } from '../internal/types';


export function compat (handler: ClassicHandler): NextHandler {
	return function compatHandler ({ request, response }, next) {
		return handler(request.raw, response.raw, next);
	}
}


export type ClassicHandler =
	(req: IncomingMessage, res: ServerResponse, next: any) => Promisable<void>;
