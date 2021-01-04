import type { ServerResponse } from 'http';
import { toString } from '../internal/utils';


export class ResponseHeaders {
	_response: ServerResponse;

	/**
	 * Response headers wrapper
	 */
	constructor (response: ServerResponse) {
		this._response = response;
	}

	*[Symbol.iterator] (): Generator<[key: string, value: string], void, unknown> {
		for (let key of this._response.getHeaderNames()) {
			yield [key, this.get(key)!];
		}
	}

	/**
	 * Whether or not the response has been sent
	 */
	get sent (): boolean {
		return this._response.headersSent;
	}

	/**
	 * Whether or not a response header exist
	 */
	has (key: string): boolean {
		return this._response.hasHeader(key);
	}

	/**
	 * Get a response header value
	 */
	get (key: string): string | undefined {
		let value = this._response.getHeader(key);
		if (value === undefined) return;
		return Array.isArray(value) ? value.join('; ') : toString(value);
	}

	/**
	 * Set a response header value
	 */
	set (key: string, value: string | string[] | number): this {
		this._response.setHeader(key, Array.isArray(value) ? value.join('; ') : toString(value));
		return this;
	}

	/**
	 * Remove a response header
	 */
	remove (key: string): this {
		this._response.removeHeader(key);
		return this;
	}

	/**
	 * Removes all response headers
	 */
	clear (): this {
		for (let key of this._response.getHeaderNames()) this.remove(key);
		return this;
	}

	/**
	 * Append a value into a response header
	 */
	append (key: string, value: string | number): this {
		this.set(key, (this.has(key) ? this.get(key) + ', ' : '') + value);
		return this;
	}

	/**
	 * Prepend a value into a response header
	 */
	prepend (key: string, value: string | number): this {
		this.set(key, value + (this.has(key) ? ', ' + this.get(key) : ''));
		return this;
	}
}
