import { ServerResponse, IncomingMessage } from 'http';
import { Router } from './Router.js';
import { SrvRequest } from '../request/SrvRequest.js';
import { SrvResponse } from '../response/SrvResponse.js';
import { EMPTY_STATUS_CODES, isInteger } from '../internal/utils.js';
import { Stream } from 'stream';


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
 * @typedef {object} Context
 * @property {Application} app
 * @property {SrvRequest} request
 * @property {SrvResponse} response
 * @property {object} state
 * @property {object} router
 * @property {?object} router.params
 */

export class Application {
	/** @type {Router} */
	router = new Router();
	handler = handler.bind(this);

	/**
	 * Mounts additional middlewares to a specific route
	 * @param {string} path
	 * @param  {...NextHandler} handlers
	 * @returns {this}
	 */
	mount (path, ...handlers) {
		this.router.mount(path, ...handlers);
		return this;
	}

	/**
	 * Adds a route handler
	 * @param {string} method
	 * @param {string} path
	 * @param {...NextHandler} handlers
	 * @returns {this}
	 */
	route (method, path, ...handlers) {
		this.router.route(method, path, ...handlers);
		return this;
	}
}

/**
 * @type {RequestHandler}
 * @this {Application}
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function handler (req, res) {
	let app = this;
	let request = new SrvRequest(req);
	let response = new SrvResponse(res);
	let router = {};
	let state = {};


	/** @type {Context} */
	let ctx = { app, request, response, router, state };
	let { params, handlers } = app.router.match(request.method, request.url.path);
	let lastIndex = -1;

	res.statusCode = 404;
	router.params = params;

	dispatch().then(() => respond(ctx)).catch((err) => response.onError(err));

	async function dispatch (index = 0) {
		if (index <= lastIndex) throw new Error('next() called multiple times');
		lastIndex = index;

		if (!handlers.length || index == handlers.length) return;

		let handler = handlers[index];
		return await handler(ctx, dispatch.bind(this, index + 1));
	}
}

/**
 * @type {NextHandler}
 * @param {Context} ctx
 */
function respond (ctx) {
	let { request, response, respond = true } = ctx;
	if (respond === false || !response.writable) return;

	let { raw, headers, body, length } = response;

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
		return raw.end();
	}

	if (typeof body == 'string' || Buffer.isBuffer(body)) {
		return raw.end(body);
	}

	if (body instanceof Stream) {
		return body.pipe(raw);
	}

	body = JSON.stringify(body);
	if (!headers.sent) response.length = Buffer.byteLength(body);

	return raw.end(body);
}
