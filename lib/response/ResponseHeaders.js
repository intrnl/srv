import { ServerResponse } from 'http';
import { toString } from '../internal/utils.js';


export class ResponseHeaders {
	/** @type {ServerResponse} */
	#response;

	/**
	 * Response headers wrapper
	 * @param {ServerResponse} response
	 */
	constructor (response) {
		this.#response = response;
	}

	/**
	 * Iterate through response headers
	 */
	*[Symbol.iterator] () {
		for (let key of this.#response.getHeaderNames()) {
			yield [key, this.get(key)];
		}
	}

	/**
	 * Whether the response headers has been sent
	 * @returns {boolean}
	 */
	get sent () {
		return this.#response.headersSent;
	}

	/**
	 * Set response header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	set (key, value) {
		value = Array.isArray(value) ? value.join(', ') : toString(value);
		this.#response.setHeader(key, value);
		return value;
	}

	/**
	 * Get response header
	 * @param {string} key
	 * @returns {?string}
	 */
	get (key) {
		let value = this.#response.getHeader(key);
		if (value === undefined) return;
		return Array.isArray(value) ? value.join(', ') : toString(value);
	}

	/**
	 * Has response header
	 * @param {string} key
	 * @returns {boolean}
	 */
	has (key) {
		return this.#response.hasHeader(key);
	}

	/**
	 * Remove response header
	 * @param {string} key
	 * @returns {void}
	 */
	remove (key) {
		return this.#response.removeHeader(key);
	}

	/**
	 * Remove all response headers
	 * @returns {void}
	 */
	clear () {
		for (let key of this.#response.getHeaderNames()) {
			this.remove(key);
		}
	}

	/**
	 * Append value into response header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	append (key, value) {
		return this.set(key, (this.has(key) ? this.get(key) + ', ' : '') + value);
	}

	/**
	 * Prepend value into response header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	prepend (key, value) {
		return this.set(key, value + (this.has(key) ? ', ' + this.get(key) : ''));
	}
}
