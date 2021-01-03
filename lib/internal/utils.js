export let EMPTY_STATUS_CODES = new Set([204, 205, 304]);

export let byteLength = Buffer.byteLength;

export let toString = String;
export let isInteger = Number.isInteger;

export let isHTML = /^\s*</;

/**
 * Ensure leading slash
 * @param {string} str
 * @returns {string}
 */
export function lead (str) {
	return str[0] == '/' ? str : '/' + str;
}
