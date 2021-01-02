import { URLSearchParams } from 'url';


/**
 * Small URL parser for dealing with path information only
 */
export class ParsedUrl {
	/**
	 * Parsed request URL
	 * @param {string} url
	 */
	constructor (url) {
		let searchIndex = url.indexOf('?', 1);

		this.href = url;
		this.path = searchIndex != -1 ? url.slice(0, searchIndex) : url;
		this.search = searchIndex != -1 ? url.slice(searchIndex) : null;

		/** @type {URLSearchParams | null} */
		this._searchParams = null;
	}

	get searchParams () {
		return this._searchParams || (this._searchParams = new URLSearchParams(this.search));
	}
}
