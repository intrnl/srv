export class ResponseError extends Error {
	expose: boolean;
	status: number;

	constructor (code: number | null | undefined, error: any) {
		super('message' in error ? error.message : error);
		Error.captureStackTrace(this, ResponseError);

		this.status = code != null ? code : 500;
		this.expose = this.status < 500;
	}
}
