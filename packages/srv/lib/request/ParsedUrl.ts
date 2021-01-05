import { URLSearchParams } from 'url';


/**
 * Small URL parser that only deals with path information
 */
export class ParsedUrl {
	href: string;
	path: string;
	search: string | null;

	_searchParams?: URLSearchParams;

	constructor (url: string) {
		let index = url.indexOf('?', 1);

		this.href = url;
		this.path = index != -1 ? url.slice(0, index) : url;
		this.search = index != -1 ? url.slice(index) : null;
	}

	get searchParams (): URLSearchParams {
		return this._searchParams || (this._searchParams = new URLSearchParams(this.search!));
	}
}
