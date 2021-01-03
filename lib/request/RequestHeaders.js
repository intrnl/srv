import { IncomingMessage } from 'http';
import { toString } from '../internal/utils.js';

/** @typedef {import('http').IncomingHttpHeaders} IncomingHttpHeaders */


export class RequestHeaders {
	/** @type {IncomingHttpHeaders} */
	#headers;

	/**
	 * Request headers wrapper
	 * @param {IncomingMessage} request
	 */
	constructor (request) {
		this.#headers = request.headers;
	}

	/**
	 * Iterate through request headers
	 */
	*[Symbol.iterator] () {
		for (let key in this.#headers) {
			yield [key, this.#headers[key]];
		}
	}

	/**
	 * Set request header
	 * @param {string} key
	 * @param {string | string[]} value
	 * @returns {string}
	 */
	set (key, value) {
		return this.#headers[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : toString(value);
	}

	/**
	 * Get request header
	 * @param {string} key
	 * @returns {string | undefined}
	 */
	get (key) {
		let value = this.#headers[key.toLowerCase()];
		if (value === undefined) return;
		return Array.isArray(value) ? value.join(', ') : toString(value);
	}

	/**
	 * Has request header
	 * @param {string} key
	 * @returns {boolean}
	 */
	has (key) {
		return key.toLowerCase() in this.#headers;
	}

	/**
	 * Remove request header
	 * @param {string} key
	 * @returns {void}
	 */
	remove (key) {
		delete this.#headers[key.toLowerCase()];
	}

	/**
	 * Remove all request header
	 * @returns {void}
	 */
	clear () {
		for (let key in this.#headers) {
			this.remove(key);
		}
	}

	/**
	 * Append value into request header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	append (key, value) {
		return this.set(key, (this.has(key) ? this.get(key) + ', ' : '') + value);
	}

	/**
	 * Prepend value into request header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	prepend (key, value) {
		return this.set(key, value + (this.has(key) ? ', ' + this.get(key) : ''));
	}
}
