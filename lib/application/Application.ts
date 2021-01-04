import { ok as assert } from 'assert';
import { Stream } from 'stream';
import type { IncomingMessage, ServerResponse } from 'http';
import { Promisable } from '../internal/types';
import { compose } from '../internal/compose-middlewares';
import { SrvRequest } from '../request/SrvRequest';
import { SrvResponse } from '../response/SrvResponse';
import { byteLength, EMPTY_STATUS_CODES, isInteger } from '../internal/utils';


export class Application {
	middlewares: NextHandler[] = [];
	dispatcher = compose(this.middlewares);

	handler = (req: IncomingMessage, res: ServerResponse) => {
		let context = this.createContext(req, res);
		return this.handleResponse(context, this.dispatcher);
	};


	/**
	 * Adds middlewares
	 */
	use (...handlers: NextHandler[]): this {
		assert(handlers.every((h) => typeof h == 'function'), 'handler must be a function');

		this.middlewares.push(...handlers);
		return this;
	}

	/**
	 * Handle responding
	 */
	handleResponse (context: Context, dispatch: Dispatcher): Promise<void> {
		return dispatch(context)
			.then(() => respond(context))
			.catch((error) => context.response.onError(error));
	}

	/**
	 * Creates context based on request given
	 */
	createContext (req: IncomingMessage, res: ServerResponse): Context {
		return {
			app: this,
			request: new SrvRequest(req),
			response: new SrvResponse(res),
			state: {},
		};
	}
}

function respond (context: Context): void {
	let { request, response, respond = true } = context;
	if (respond === false || !response.writable) return;

	let { method } = request;
	let { raw, status, message, headers, body, length, _explicitNullBody } = response;

	if (EMPTY_STATUS_CODES.has(status)) {
		response.body = null;
		return raw.end();
	}

	if (method == 'HEAD') {
		if (!headers.sent && !headers.has('content-type')) {
			if (isInteger(length)) response.length = length;
		}

		raw.end();
		return;
	}

	if (body == null) {
		if (_explicitNullBody) return raw.end();

		if (!headers.sent) {
			response.type = 'text/plain';
			response.length = byteLength(message);
		}

		raw.end(message);
		return;
	}

	if (typeof body == 'string' || Buffer.isBuffer(body)) {
		raw.end(body)
		return;
	}

	if (body instanceof Stream) {
		body.pipe(raw);
		return;
	}

	body = JSON.stringify(body);
	if (!headers.sent) response.length = byteLength(body);

	raw.end(body);
}


export interface Context {
	app: Application,
	request: SrvRequest,
	response: SrvResponse,
	state: Record<string, any>,
	respond?: boolean,
}

export type NextHandler = (context: Context, next: () => Promise<void>) => Promisable<void>;
export type Dispatcher = (context: Context, next?: () => Promise<void>) => Promise<void>;
