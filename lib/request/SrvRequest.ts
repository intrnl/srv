import type { IncomingMessage } from 'http';
import { RequestHeaders } from './RequestHeaders';
import { ParsedUrl } from './ParsedUrl';


/**
 * Request wrapper
 */
export class SrvRequest {
	raw: IncomingMessage;
	rawBody?: Buffer;
	body?: any;
	params: Record<string, string> = {};

	_headers?: RequestHeaders;
	_parsedUrl?: ParsedUrl;

	constructor (request: IncomingMessage) {
		this.raw = request;
	}

	/**
	 * Request method
	 */
	get method (): string {
		return this.raw.method!;
	}

	/**
	 * Request URL
	 */
	get url (): ParsedUrl {
		return this._parsedUrl || (this._parsedUrl = new ParsedUrl(this.raw.url!));
	}

	/**
	 * Request headers
	 */
	get headers (): RequestHeaders {
		return this._headers || (this._headers = new RequestHeaders(this.raw));
	}

	/**
	 * Request Content-Type header
	 */
	get type (): string | undefined {
		return this.headers.get('content-type');
	}

	set type (value: string | undefined) {
		if (value == null) this.headers.remove('content-type');
		else this.headers.set('content-type', value);
	}
}
