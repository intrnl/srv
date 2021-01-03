/** @typedef {import('../application/Application').NextHandler} NextHandler */
/** @typedef {import('../application/Application').Context} Context */
/** @typedef {import('../application/Application').Dispatcher} Dispatcher */


/**
 * Composes middlewares
 * @param {NextHandler[]} middlewares
 * @returns {Dispatcher}
 */
export function compose (middlewares) {
	return function dispatcher (context, next) {
		let lastIndex = -1;

		let promise = dispatch();
		return typeof next == 'function' ? promise.then(next) : promise;

		function dispatch (index = 0) {
			if (index <= lastIndex) return Promise.reject(new Error('next() called multiple times'));
			lastIndex = index;

			if (!middlewares.length || index == middlewares.length) return Promise.resolve();

			let handler = middlewares[index];

			try {
				return Promise.resolve(handler(context, dispatch.bind(this, index + 1)));
			} catch (err) {
				return Promise.reject(err);
			}
		}
	}
}
