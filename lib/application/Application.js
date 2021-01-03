import { ServerResponse, IncomingMessage } from 'http';
import { Stream } from 'stream';
import { ok as assert } from 'assert';
import { SrvRequest } from '../request/SrvRequest.js';
import { SrvResponse } from '../response/SrvResponse.js';
import { compose } from '../internal/compose-middlewares.js';
import { EMPTY_STATUS_CODES, byteLength, isInteger } from '../internal/utils.js';


/**
 * Request handler
 * @callback RequestHandler
 * @this {Application}
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @returns {void}
 */

/**
 * @callback NextHandler
 * @param {Context} context
 * @param {function} next
 */


/**
 * @callback Dispatcher
 * @param {Context} context
 * @returns {Promise<void>}
 */

/**
 * @typedef {object} Context
 * @property {Application} app
 * @property {SrvRequest} request
 * @property {SrvResponse} response
 * @property {object} state
 */

export class Application {
	/** @type {NextHandler[]} */
	middlewares = [];
	/** @type {RequestHandler} */
	handler = this.handler.bind(this);
	/** @type {Dispatcher} */
	dispatch = compose(this.middlewares);

	/**
	 * Request handler
	 * @param {IncomingMessage} req
	 * @param {ServerResponse} res
	 * @returns {void}
	 */
	handler (req, res) {
		let context = this.createContext(req, res);
		this.handleResponse(context, this.dispatch);
	}

	/**
	 * Adds middlewares
	 * @param {...NextHandler} handlers
	 * @returns {this}
	 */
	use (...handlers) {
		assert(handlers.every((handler) => typeof handler == 'function'), 'handler must be a function');

		this.middlewares.push(...handlers);
		return this;
	}

	/**
	 * Creates context based on request
	 * @param {IncomingMessage} req
	 * @param {ServerResponse} res
	 * @returns {Context}
	 */
	createContext (req, res) {
		let app = this;
		let request = new SrvRequest(req);
		let response = new SrvResponse(res);
		let state = {};

		return { app, request, response, state };
	}

	/**
	 * Handles request
	 * @param {Context} context
	 * @param {Dispatcher} dispatch
	 * @returns {Promise<void>}
	 */
	async handleResponse (context, dispatch) {
		try {
			await dispatch(context);
			respond(context);
		} catch (error) {
			context.response.onError(error);
		}
	}
}

/**
 * Default final response handler
 * @param {Context} context
 */
function respond (context) {
	let { request, response, respond = true } = context;
	if (respond === false || !response.writable) return;

	let { raw, message, headers, body, length, _explicitNullBody } = response;

	if (EMPTY_STATUS_CODES.has(response.status)) {
		response.body = null;
		return raw.end();
	}

	if (request.method == 'HEAD') {
		if (!headers.sent && !headers.has('content-length')) {
			if (isInteger(length)) response.length = length;
		}

		return raw.end();
	}

	if (body == null) {
		if (_explicitNullBody) return raw.end();

		if (!headers.sent) {
			response.type = 'text';
			response.length = byteLength(message);
		}

		return raw.end(message);
	}

	if (typeof body == 'string' || Buffer.isBuffer(body)) {
		return raw.end(body);
	}

	if (body instanceof Stream) {
		return body.pipe(raw);
	}

	body = JSON.stringify(body);
	if (!headers.sent) response.length = byteLength(body);

	return raw.end(body);
}
