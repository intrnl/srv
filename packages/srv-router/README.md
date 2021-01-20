# srv-router

Router middleware for Srv

## Usage

```sh
npm install @intrnl/srv-router
# pnpm install @intrnl/srv-router
# yarn add @intrnl/srv-router
```

```js
import { Application } from '@intrnl/srv';
import { Router } from '@intrnl/srv-router';

let app = new Application();
let router = new Router();

router.route('GET', '/', ({ response }) => {
  response.body = 'Hello!';
});

app.use(router.handler);
```

## Routing

Commonly used patterns for path matching is supported

```js
router.route('GET', '/users/:id', ({ request, response }) => {
  response.body = `Hello, ${request.params.id}!`;
});
```

## Mounting

You can have middlewares that runs on a specific endpoint prefix, it is
recommended that you add them first before adding any specific routes

Patterns are not supported, it will be ignored and be treated as regular path.

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
