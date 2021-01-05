import * as http from 'http';
import { Application } from '@intrnl/srv';
import { Router } from '@intrnl/srv-router';


function one ({ request }, next) {
	request.one = true;
	return next();
}

function two ({ request }, next) {
	request.two = true;
	return next();
}

let router = new Router()
	.route('GET', '/favicon.ico', () => {})
	.route('GET', '/', ({ response }) => { response.body = 'Hello'; })
	.route('GET', '/user/:id', ({ request, response }) => { response.body = `User: ${request.params.id}` });

let app = new Application()
	.use(one, two)
	.use(router.handler);

http.createServer(app.handler).listen(3030);
