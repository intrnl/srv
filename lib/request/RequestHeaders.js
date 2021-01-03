import { toString } from '../internal/utils.js';

/** @typedef {import('http').IncomingMessage} IncomingMessage */
/** @typedef {import('http').IncomingHttpHeaders} IncomingHttpHeaders */


export class RequestHeaders {
	/** @type {IncomingHttpHeaders} */
	_headers;

	/**
	 * Request headers wrapper
	 * @param {IncomingMessage} request
	 */
	constructor (request) {
		this._headers = request.headers;
	}

	/**
	 * Iterate through request headers
	 */
	*[Symbol.iterator] () {
		for (let key in this._headers) {
			yield [key, this._headers[key]];
		}
	}

	/**
	 * Has request header
	 * @param {string} key
	 * @returns {boolean}
	 */
	has (key) {
		return key.toLowerCase() in this._headers;
	}

	/**
	 * Get request header
	 * @param {string} key
	 * @returns {string | undefined}
	 */
	get (key) {
		let value = this._headers[key.toLowerCase()];
		if (value === undefined) return;
		return Array.isArray(value) ? value.join(', ') : toString(value);
	}

	/**
	 * Set request header
	 * @param {string} key
	 * @param {string | string[]} value
	 * @returns {string}
	 */
	set (key, value) {
		return this._headers[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : toString(value);
	}

	/**
	 * Remove request header
	 * @param {string} key
	 * @returns {void}
	 */
	remove (key) {
		delete this._headers[key.toLowerCase()];
	}

	/**
	 * Removes all request header
	 * @returns {void}
	 */
	clear () {
		for (let key in this._headers) {
			this.remove(key);
		}
	}

	/**
	 * Append value into a request header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	append (key, value) {
		return this.set(key, (this.has(key) ? this.get(key) + ', ' : '') + value);
	}

	/**
	 * Prepend value into a request header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	prepend (key, value) {
		return this.set(key, value + (this.has(key) ? ', ' + this.get(key) : ''));
	}
}
