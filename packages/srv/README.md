# Srv

A lightweight HTTP web framework.

## Usage

Uses ES Modules, requires Node v14.13.0+

**For TypeScript users**: Be sure to install `@types/node` for Node.js typings

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

## Motivation

The point of Srv isn't about being fast. While it is faster than Koa and
especially Express by any stretch, it's also about being lightweight while
still being able to provide a lot out of the box.

Srv doesn't come with any dependencies, see how it stacks up with commonly used
frameworks along with their middlewares:

- srv@0.1.0: [29.7 KB installed](https://packagephobia.com/result?p=@intrnl/srv@0.1.0)
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