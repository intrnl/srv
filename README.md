# Srv

Lightweight, Koa-inspired web framework, because worse is better

## Usage

> **Not published yet**  
> However, you can still try by installing `github:intrnl/srv` instead

Uses ES Modules, requires Node v14.13.0+

```sh
npm install @intrnl/srv
# pnpm install @intrnl/srv
# yarn add @intrnl/srv
```

```js
import * as http from 'http';
import { Application } from '@intrnl/srv';

let app = new Application();

app.use(({ request, response }) => {
  response.body = 'Hello, world!';
});

http.createServer(app.handler).listen(1234);
```

## Middlewares

An Srv application is essentially a chain of middlewares, they are functions
that runs in between of receiving the request and responding to it

```js
app.use(({ request }, next) => {
  console.log(`-> Received ${request.method} on ${request.url.path}`);
  return next(); // move on to the next middleware
});

app.use(({ response }) => {
  response.body = 'Hello world!';
  // we're not calling the next handler, so the chain will stop here
});
```

As middlewares are asynchronous in nature, **they must return or await when
trying to call the next one**, or you will stop the chain early before the next
middleware is able to handle the request, causing race conditions and unhandled
promise rejections

```js
app.use(async (ctx, next) => {
  // you await like so
  await next();
});

app.use((ctx, next) => {
  // or you can just return it directly
  return next();
});
```

In return, the nature of middlewares being asynchronous makes it possible for
them to snoop on responses before it is actually sent out

```js
app.use(async ({ response }, next) => {
  await next();

  // ooh, so we're sending greetings!
  console.log(response.body);
});

app.use(({ response }) => {
  response.body = 'Greetings!';
});
```

## Routing

A router is provided out of the box for running middlewares based on HTTP
methods and endpoints

```js
import { Application, Router } from '@intrnl/srv';

let app = new Application();
let router = new Router();

router.route('GET', '/', ({ response }) => {
  response.body = 'Hello!';
});

app.use(router.handler);
```

Commonly used patterns for route matching is supported

- static: `/` `/users` `/users/all`
- parameters: `/users/:id` `/users/:id/books/:title`
- optional parameters: `/books/:genre?/:type?`
- suffix parameters: `/movies/:title.mp4` `/movies/:title.(mp4|webm)`
- wildcards: `/movies/*`

```js
router.route('GET', '/users/:id', ({ request, response }) => {
  response.body = `Hello, ${request.params.id}!`;
});
```

You can have middlewares that runs on a specific endpoint prefix, it is
recommended that you add them first before adding any specific routes

```js
router.mount('/user', (ctx, next) => {
  // this will run on on every request that starts with /user/
  return next();
});
```

Mounting another router is supported, allowing for subrouting

```js
let app = new Application();
let forum = new Router();
let main = new Router();

forum.route('GET', '/', ({ response }) => {
  response.body = 'Welcome to the forum!';
});

main.mount('/forum', forum.handler);

main.route('GET', '/', ({ response }) => {
  response.body = 'Welcome to the main page!';
});

app.use(main.handler);
```

## Builtin goodies

Srv currently provides these middlewares out of the box

- Raw request body (`@intrnl/srv/middlewares/raw-body`)
- Body parser (`@intrnl/srv/middlewares/parse-body`)
