import type { IncomingMessage, IncomingHttpHeaders } from 'http';
import { toString } from '../internal/utils';


export class RequestHeaders {
	_headers: IncomingHttpHeaders;

	constructor (request: IncomingMessage) {
		this._headers = request.headers;
	}

	/**
	 * Whether or not a request header exist
	 */
	has (key: string): boolean {
		return key.toLowerCase() in this._headers;
	}

	/**
	 * Get a request header value
	 */
	get (key: string): string | undefined {
		let value = this._headers[key.toLowerCase()];
		if (value == undefined) return;
		return Array.isArray(value) ? value.join('; ') : toString(value);
	}

	/**
	 * Set a request header value
	 */
	set (key: string, value: string | string[] | number): this {
		this._headers[key.toLowerCase()] = Array.isArray(value)
			? value.join('; ')
			: toString(value);

		return this;
	}

	/**
	 * Remove a request header
	 */
	remove (key: string): this {
		delete this._headers[key.toLowerCase()];
		return this;
	}

	/**
	 * Removes all request headers
	 */
	clear (): this {
		for (let key in this._headers) this.remove(key);
		return this;
	}

	/**
	 * Appends a value into a request header
	 */
	append (key: string, value: string | number): this {
		return this.set(key, (this.has(key) ? this.get(key) + ', ' : '') + value);
	}

	/**
	 * Prepends a value into a request header
	 */
	prepend (key: string, value: string | number): this {
		return this.set(key, value + (this.has(key) ? ', ' + this.get(key) : ''));
	}
}
