import { IncomingMessage } from 'http';
import { RequestHeaders } from './RequestHeaders.js';
import { ParsedUrl } from './ParsedUrl.js';


export class SrvRequest {
	/** @type {IncomingMessage} */
	raw;
	/** @type {any} */
	body = null;
	/** @type {object} */
	params = {};
	/** @type {RequestHeaders | undefined} */
	#headers;
	/** @type {ParsedUrl | undefined} */
	#parsedUrl;

	/**
	 * Request wrapper
	 * @param {IncomingMessage} request
	 */
	constructor (request) {
		this.raw = request;
	}

	/**
	 * Get request method
	 */
	get method () {
		return this.raw.method;
	}

	/**
	 * Get request URL
	 */
	get url () {
		return this.#parsedUrl || (this.#parsedUrl = new ParsedUrl(this.raw.url));
	}

	/**
	 * Get request headers
	 */
	get headers () {
		return this.#headers || (this.#headers = new RequestHeaders(this.raw));
	}
}
