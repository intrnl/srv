import * as http from 'http';
import { Application } from '@intrnl/srv';


function one ({ request }, next) {
	request.one = true;
	return next();
}

function two ({ request }, next) {
	request.two = true;
	return next();
}

let app = new Application()
	.mount('/', one, two)
	.route('GET', '/favicon.ico', () => {})
	.route('GET', '/', ({ response }) => { response.body = 'Hello' })
	.route('GET', '/user/:id', ({ response, router }) => { response.body = `User: ${router.params.id}` });

http.createServer(app.handler).listen(3030);
