import { ServerResponse, STATUS_CODES } from 'http';
import { Stream } from 'stream';
import { ok as assert } from 'assert';
import { ResponseHeaders } from './ResponseHeaders.js';
import { ResponseError } from './ResponseError.js';
import { EMPTY_STATUS_CODES, isHTML, isInteger } from '../internal/utils.js';


export class SrvResponse {
	/** @type {ServerResponse} */
	raw;
	/** @type {ResponseHeaders | undefined} */
	#headers;
	/** @type {any} */
	#body;
	/** @type {boolean}  */
	#explicitStatus = false;

	/**
	 * Response wrapper
	 * @param {ServerResponse} response
	 */
	constructor (response) {
		this.raw = response;
	}

	/**
	 * Whether or not the response is still writable
	 */
	get writable () {
		return this.raw.writable;
	}

	/**
	 * Response status code
	 */
	get status () {
		return this.raw.statusCode;
	}

	set status (code) {
		assert(isInteger(code), 'status must be a number');
		assert(code >= 100 && code <= 999, 'invalid status code');

		this.#explicitStatus = true;
		this.raw.statusCode = code;
	}

	/**
	 * Get response headers
	 */
	get headers () {
		return this.#headers || (this.#headers = new ResponseHeaders(this.raw));
	}

	/**
	 * Response body
	 */
	get body () {
		return this.#body;
	}

	set body (value) {
		this.#body = value

		if (value == null) {
			if (EMPTY_STATUS_CODES.has(this.status)) this.status = 204;
			this.type = null;
			this.length = null;

			this.headers.remove('transfer-encoding');
			return;
		}

		if (!this.#explicitStatus) {
			this.status = 200;
		}

		if (typeof value == 'string') {
			this.type = isHTML.test(value) ? 'text/html' : 'text/plain';
			this.length = Buffer.byteLength(value);
		} else if (Buffer.isBuffer(value)) {
			this.type = 'application/octet-stream';
			this.length = value.length;
		} else if (value instanceof Stream) {
			this.type = 'application/octet-stream';
			this.length = null;
		} else {
			this.type = 'application/json';
			this.length = null;
		}
	}

	/**
	 * Response Content-Type header
	 */
	get type () {
		return this.headers.get('content-type');
	}

	set type (value) {
		if (value == null) return this.headers.remove('content-type');
		this.headers.set('content-type', value);
	}

	/**
	 * Response Content-Length header
	 */
	get length () {
		if (this.headers.has('content-length')) {
			return this.headers.get('content-length') | 0;
		}

		let { body } = this;
		if (!body || body instanceof Stream) return undefined;
		if (Buffer.isBuffer(body)) return body.length;
		return Buffer.byteLength(typeof body == 'string' ? body : JSON.stringify(body));
	}

	set length (value) {
		if (value == null) return this.headers.remove('content-length');
		this.headers.set('content-length', value);
	}

	/**
	 * Throws an error with status code and message, exposing the message to
	 * client if status code is below 500
	 * @param {number} code
	 * @param {message} message
	 * @throws {ResponseError}
	 */
	throw (code, message) {
		throw new ResponseError(code, message);
	}

	/**
	 * Default error handling
	 * @param {any} error
	 */
	onError (error) {
		if (error == null || this.headers.sent) return;

		let headers = Array.isArray(error.headers) ? error.headers : Object.entries(error.headers || {});
		for (let [key] of this.headers) this.headers.remove(key);
		for (let [key, value] of headers) this.headers.set(key, value);

		let code = error.status || error.statusCode || 500;
		let msg = error.expose ? error.message : STATUS_CODES[code];

		console.log(error);

		this.status = code;
		this.type = 'text/plain';
		this.length = Buffer.byteLength(msg);
		this.raw.end(msg);
	}
}
