# Srv

A lightweight HTTP web framework.

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

An Srv application is essentially a chain of middlewares; like a middleman, they
are functions that runs in between receiving and responding to a request, and
they can run code before and after the next one

```js
// Logger
app.use(({ request }, next) => {
  console.log(`-> Received ${request.method} on ${request.url.path}`);
  return next();
});

// Response time
app.use(async ({ response }, next) => {
  let start = Date.now();
  await next();
  let end = Date.now();
  response.headers.set('x-response-time', end - start);
});

// Response
app.use(({ response }) => {
  response.body = 'Hello, world!';
});
```

**Middlewares must return or await when trying to call the next one**, or you
will stop the chain early before the next middleware is able to handle the
request, causing race conditions and unhandled promise rejections

```js
app.use((ctx, next) => {
  // you return it like so
  return next();
});

app.use(async (ctx, next) => {
  // or await, if you need to run something after the next middleware
  await next();
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

## Motivation

The point of Srv isn't about being fast. While it is faster than Koa and
especially Express by any stretch, it's also about being lightweight while
still being able to provide a lot out of the box.

Srv doesn't come with any dependencies, and only weighs about 30 KB while
also providing its own set of middlewares, see how it stacks up to the commonly
used ones below:

- connect@3.7.0: [236 KB installed](https://packagephobia.com/result?p=connect@3.7.0)
- express@4.17.1: [1.61 MB installed](https://packagephobia.com/result?p=express@4.17.1)
- koa@2.13.1: [908 KB installed](https://packagephobia.com/result?p=koa@2.13.1)
- fastify@3.9.2: [4.48 MB installed](https://packagephobia.com/result?p=fastify@3.9.2)
- router@1.3.5: [153 KB installed](https://packagephobia.com/result?p=router@1.3.5)
- koa-router@10.0.0: [281 KB installed](https://packagephobia.com/result?p=koa-router@10.0.0)
- body-parser@1.19.0: [0.979 MB installed](https://packagephobia.com/result?p=body-parser@1.19.0)

There are even lighter ones, and potentially even faster than Srv too, with
little to no abstractions between the app and Node.js underlying HTTP server.
But personally I think that Srv can serve as a lesson on how it would be if the
underlying server was made today, and not years ago.
