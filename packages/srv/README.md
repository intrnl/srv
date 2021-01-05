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
