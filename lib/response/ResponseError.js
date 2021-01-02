export class ResponseError extends Error {
	/** @type {boolean} */
	expose = false;
	/** @type {number} */
	status = 500;

	constructor (code, message) {
		super(message?.message || message);
		Error.captureStackTrace(this, ResponseError);

		if (code != null) this.status = code;
		this.expose = this.status < 500;
	}
}
