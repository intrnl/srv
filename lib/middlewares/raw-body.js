import * as zlib from 'zlib';

/** @typedef {import('../application/Application').NextHandler} NextHandler */

/**
 * @returns {NextHandler}
 */
export function rawBody () {
	return function rawBodyHandler ({ request, response }, next) {
		let type = request.headers.get('content-encoding');

		let chunks = [];
		let stream = request.raw;

		if (type == 'gzip') {
			stream = stream.pipe(zlib.Gunzip());
		} else if (type == 'deflate') {
			stream = stream.pipe(zlib.createDeflate());
		} else if (type == 'br') {
			stream = stream.pipe(zlib.createBrotliDecompress());
		} else if (type == 'identity') {
			// do nothing
		} else if (type) {
			response.throw(415, `Unsupported Content-Encoding: ${type}`);
		}

		return new Promise((resolve, reject) => {
			stream.on('data', (chunk) => {
				chunks.push(chunk);
			});

			stream.on('end', () => {
				request.rawBody = Buffer.concat(chunks);
				resolve(next());
			});

			stream.on('error', (err) => {
				reject(err);
			});
		})
	}
}
