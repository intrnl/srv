import Koa from 'koa';
import Router from 'koa-router';


function one ({ request }, next) {
	request.one = true;
	return next();
}

function two ({ request }, next) {
	request.two = true;
	return next();
}


let app = new Koa()
let router = new Router();

router
	.get('/favicon.ico', () => {})
	.get('/', (ctx) => { ctx.body = 'Hello' })
	.get('/user/:id', (ctx) => { ctx.body = `User: ${ctx.params.id}` });

app
	.use(one)
	.use(two)
	.use(router.routes())
	.use(router.allowedMethods)
	.listen(3030);
