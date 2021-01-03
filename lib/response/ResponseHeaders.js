import { toString } from '../internal/utils.js';

/** @typedef {import('http').ServerResponse} ServerResponse */


export class ResponseHeaders {
	/** @type {ServerResponse} */
	_response;

	/**
	 * Response headers wrapper
	 * @param {ServerResponse} response
	 */
	constructor (response) {
		this._response = response;
	}

	/**
	 * Iterate through response headers
	 */
	*[Symbol.iterator] () {
		for (let key of this._response.getHeaderNames()) {
			yield [key, this.get(key)];
		}
	}

	/**
	 * Whether the response headers has been sent
	 * @returns {boolean}
	 */
	get sent () {
		return this._response.headersSent;
	}

	/**
	 * Has response header
	 * @param {string} key
	 * @returns {boolean}
	 */
	has (key) {
		return this._response.hasHeader(key);
	}

	/**
	 * Get response header
	 * @param {string} key
	 * @returns {string | undefined}
	 */
	get (key) {
		let value = this._response.getHeader(key);
		if (value === undefined) return;
		return Array.isArray(value) ? value.join(', ') : toString(value);
	}

	/**
	 * Set response header
	 * @param {string} key
	 * @param {string | string[]} value
	 * @returns {string}
	 */
	set (key, value) {
		value = Array.isArray(value) ? value.join(', ') : toString(value);
		this._response.setHeader(key, value);
		return value;
	}

	/**
	 * Remove response header
	 * @param {string} key
	 * @returns {void}
	 */
	remove (key) {
		return this._response.removeHeader(key);
	}

	/**
	 * Removes all response headers
	 * @returns {void}
	 */
	clear () {
		for (let key of this._response.getHeaderNames()) {
			this.remove(key);
		}
	}

	/**
	 * Append value into a response header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	append (key, value) {
		return this.set(key, (this.has(key) ? this.get(key) + ', ' : '') + value);
	}

	/**
	 * Prepend value into a response header
	 * @param {string} key
	 * @param {string} value
	 * @returns {string}
	 */
	prepend (key, value) {
		return this.set(key, value + (this.has(key) ? ', ' + this.get(key) : ''));
	}
}
