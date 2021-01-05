export let EMPTY_STATUS_CODES = new Set([204, 205, 304]);
export let HTML_RE = /^\s*</;

export let byteLength = Buffer.byteLength;

export let toString = String;
export let isInteger = Number.isInteger;
export let isBuffer = Buffer.isBuffer;

export function lead (str: string) {
	return str[0] == '/' ? str : '/' + str;
}
