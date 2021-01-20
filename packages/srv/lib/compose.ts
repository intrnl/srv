import type { Dispatcher, NextHandler } from './application';


export function compose (handlers: NextHandler[]): Dispatcher {
	return function dispatcher (context, next) {
		let last = -1;

		return dispatch();

		function dispatch (index = 0): Promise<void> {
			if (index <= last) return Promise.reject(new Error('next() called multiple times'));
			last = index;

			let handler = handlers.length == index ? next : handlers[index];
			if (!handler) return Promise.resolve();

			try {
				return Promise.resolve(handler(context, dispatch.bind(null, index + 1)));
			} catch (error) {
				return Promise.reject(error);
			}
		}
	}
}
