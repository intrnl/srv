import { IncomingMessage } from 'http';
import { RequestHeaders } from './RequestHeaders.js';
import { ParsedUrl } from './ParsedUrl.js';

/** @typedef {import('../application/Application').Application} Application */


export class SrvRequest {
	/** @type {IncomingMessage} */
	raw;
	/** @type {Buffer | null} */
	rawBody = null;
	/** @type {any} */
	body = null;
	/** @type {object} */
	params = {};
	/** @type {RequestHeaders | undefined} */
	_headers;
	/** @type {ParsedUrl | undefined} */
	_parsedUrl;

	/**
	 * Request wrapper
	 * @param {IncomingMessage} request
	 */
	constructor (request) {
		this.raw = request;
	}

	/**
	 * Request method
	 */
	get method () {
		return this.raw.method;
	}

	/**
	 * Request URL
	 */
	get url () {
		return this._parsedUrl || (this._parsedUrl = new ParsedUrl(this.raw.url));
	}

	/**
	 * Request headers
	 */
	get headers () {
		return this._headers || (this._headers = new RequestHeaders(this.raw));
	}

	/**
	 * Request Content-Type header
	 */
	get type () {
		return this.headers.get('content-type');
	}

	set type (value) {
		if (value == null) return this.headers.remove('content-type');
		this.headers.set('content-type', value);
	}
}
