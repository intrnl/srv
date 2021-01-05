import { ok as assert } from 'assert';
import { STATUS_CODES } from 'http';
import { Stream } from 'stream';
import type { ServerResponse } from 'http';
import { ResponseHeaders } from './ResponseHeaders';
import { ResponseError } from './ResponseError';
import { byteLength, EMPTY_STATUS_CODES, HTML_RE, isBuffer, isInteger } from '../internal/utils';


/**
 * Response wrapper
 */
export class SrvResponse {
	raw: ServerResponse;

	_headers?: ResponseHeaders;
	_body?: any;
	_explicitStatus?: boolean;
	_explicitNullBody?: boolean;

	constructor (response: ServerResponse) {
		this.raw = response;
	}

	/**
	 * Whether or not the response is still writable
	 */
	get writable (): boolean {
		return this.raw.writable;
	}

	/**
	 * Response status code
	 */
	get status (): number {
		return this.raw.statusCode;
	}

	set status (value: number) {
		assert(isInteger(value), 'status must be a number');
		assert(value >= 100 && value <= 999, 'invalid status code');

		this._explicitStatus = true;
		this.raw.statusCode = value;
	}

	/**
	 * Response status message
	 */
	get message (): string {
		return this.raw.statusMessage || STATUS_CODES[this.status]!;
	}

	set message (value: string) {
		assert(typeof value == 'string', 'message must be a string');

		this.raw.statusMessage = value;
	}

	/**
	 * Response headers
	 */
	get headers (): ResponseHeaders {
		return this._headers || (this._headers = new ResponseHeaders(this.raw));
	}

	/**
	 * Response body
	 */
	get body (): any {
		return this._body;
	}

	set body (value: any) {
		this._body = value;
		this._explicitNullBody = false;

		if (value == null) {
			if (EMPTY_STATUS_CODES.has(this.status)) this.status = 204;
			if (value === null) this._explicitNullBody = true;

			this.type = undefined;
			this.length = undefined;
			this.headers.remove('transfer-encoding');
			return;
		}

		if (!this._explicitStatus) {
			this.status = 200;
		}

		if (typeof value == 'string') {
			this.type = HTML_RE.test(value) ? 'text/html' : 'text/plain';
			this.length = byteLength(value);
		} else if (isBuffer(value)) {
			this.type = 'application/octet-stream';
			this.length = value.length;
		} else if (value instanceof Stream) {
			this.type = 'application/octet-stream';
			this.length = undefined;
		} else {
			this.type = 'application/json';
			this.length = undefined;
		}
	}

	/**
	 * Response Content-Type header
	 */
	get type (): string | undefined {
		return this.headers.get('content-type');
	}

	set type (value: string | undefined) {
		if (value == null) this.headers.remove('content-type');
		else this.headers.set('content-type', value);
	}

	/**
	 * Response Content-Length header
	 */
	get length (): number | undefined {
		if (this.headers.has('content-length')) {
			// @ts-expect-error
			return this.headers.get('content-length') | 0;
		}

		let { body } = this;
		if (!body || body instanceof Stream) return undefined;
		if (Buffer.isBuffer(body)) return body.length;
		return byteLength(typeof body == 'string' ? body : JSON.stringify(body));
	}

	set length (value: number | undefined) {
		if (value == null) this.headers.remove('content-length');
		else this.headers.set('content-length', value);
	}

	/**
	 * Throws an error with status code and message, exposing the message to
	 * client if status code is below 500
	 */
	throw (code: number | null | undefined, error: any): void {
		throw new ResponseError(code, error);
	}

	/**
	 * Like .throw, but with an added guard
	 */
	assert (value: any, code: number, error: any): void {
		if (!value) throw new ResponseError(code, error);
	}

	/**
	 * Default error handling
	 */
	onError (error: any) {
		if (error == null || this.headers.sent) return;

		let headers = error.headers?.[Symbol.iterator]
			? error.headers
			: Object.entries(error.headers || {});

		for (let [key] of this.headers) this.headers.remove(key);
		for (let [key, value] of headers) this.headers.set(key, value);

		let code = error.status || error.statusCode || 500;
		let msg = error.expose ? error.message : STATUS_CODES[code]!;

		this.status = code;
		this.type = 'text/plain';
		this.length = byteLength(msg);
		this.raw.end(msg);
	}
}
