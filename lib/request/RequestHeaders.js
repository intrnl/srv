import { IncomingMessage } from 'http';
import { toString } from '../internal/utils.js';

/** @typedef {import('http').IncomingHttpHeaders} IncomingHttpHeaders */


export class RequestHeaders {
	/** @type {IncomingMessage} */
	#response;
	/** @type {IncomingHttpHeaders} */
	#headers;

	/**
	 * Request headers wrapper
	 * @param {IncomingMessage} request
	 */
	constructor (request) {
		this.#response = request;
		this.#headers = request.headers;
	}

	*[Symbol.iterator] () {
		for (let key in this.#headers) {
			yield [key, this.#headers[key]];
		}
	}

	set (key, value) {
		return this.#headers[key.toLowerCase()] = toString(value);
	}

	get (key) {
		let value = this.#response[key.toLowerCase()];
		if (value === undefined) return;
		return Array.isArray(value) ? value.join(', ') : toString(value);
	}
}
