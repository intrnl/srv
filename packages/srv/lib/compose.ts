import type { Dispatcher, NextHandler } from './application';


export function compose (handlers: NextHandler[]): Dispatcher {
	return function dispatcher (context, next) {
		let last = -1;

		let promise = dispatch();
		return typeof next == 'function' ? promise.then(next) : promise;

		function dispatch (index = 0): Promise<void> {
			if (index <= last) return Promise.reject(new Error('next() called multiple times'));
			last = index;

			if (!handlers.length || index == handlers.length) return Promise.resolve();
			let handler = handlers[index];

			try {
				return Promise.resolve(handler(context, dispatch.bind(null, index + 1)));
			} catch (error) {
				return Promise.reject(error);
			}
		}
	}
}
