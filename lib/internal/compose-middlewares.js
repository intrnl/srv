/** @typedef {import('../application/Application').NextHandler} NextHandler */
/** @typedef {import('../application/Application').Context} Context */
/** @typedef {import('../application/Application').Dispatcher} Dispatcher */


/**
 * Composes middlewares
 * @param {NextHandler[]} middlewares
 * @returns {Dispatcher}
 */
export function compose (middlewares) {
	return function dispatcher (context) {
		let lastIndex = -1;

		return dispatch();

		async function dispatch (index = 0) {
			if (index <= lastIndex) throw new Error('next() called multiple times');
			lastIndex = index;

			if (!middlewares.length || index == middlewares.length) return;

			let handler = middlewares[index];
			return handler(context, dispatch.bind(this, index + 1));
		}
	}
}
