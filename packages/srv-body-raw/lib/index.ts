import * as zlib from 'zlib';
import { Stream } from 'stream';
import type { NextHandler } from '@intrnl/srv';


export function rawBody (): NextHandler {
	return function rawBodyHandler ({ request, response }, next) {
		let encoding = request.headers.get('content-encoding');

		let chunks: any[] = [];
		let stream: Stream = request.raw;

		switch (encoding) {
			case 'gzip': {
				stream = stream.pipe(zlib.createGunzip());
				break;
			}
			case 'deflate': {
				stream = stream.pipe(zlib.createDeflate());
				break;
			}
			case 'br': {
				stream = stream.pipe(zlib.createBrotliDecompress());
				break;
			}
			case 'identity': {
				// do nothing
				break;
			}
			default: {
				response.throw(415, 'Unsupported Content-Encoding');
			}
		}

		return new Promise((resolve, reject) => {
			stream.on('data', (chunk) => {
				chunks.push(chunk);
			});

			stream.on('error', (error) => {
				reject(error);
			})

			stream.on('end', () => {
				request.rawBody = Buffer.concat(chunks);
				resolve(next());
			});
		});
	}
}
