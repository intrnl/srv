import { createServer } from 'http';
import { Application } from './packages/srv/dist/index.js';
import { Router } from './packages/srv-router/dist/index.js';


let app = new Application();
let router = new Router();
let forum = new Router();


forum.route('GET', '/', ({ response }) => {
	response.body = 'Welcome to forum index';
});

forum.route('GET', '/:id', ({ request, response }) => {
	response.body = `Welcome to ${request.params.id} board`;
});


router.mount('/forum', forum.handler);

router.route('GET', '/:id?', ({ request, response }) => {
	response.body = `Hello ${request.params.id || 'World'}`;
});

app.use(router.handler);


createServer(app.handler).listen(1234, () => console.log('Listening'));
