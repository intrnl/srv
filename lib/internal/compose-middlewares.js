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

    return dispatch(0);

    function dispatch (index) {
      if (index <= lastIndex) return Promise.reject(new Error('next() called multiple times'));
      lastIndex = index;

			let handler = middlewares.length == index ? middlewares[index] : next;
      if (!handler) return Promise.resolve();

      try {
        return Promise.resolve(handler(context, dispatch.bind(this, index + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
}
