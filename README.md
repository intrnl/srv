# `srv`

Lightweight, Koa-inspired web framework

## Usage

> **Not published yet**

Uses ES Modules, requires Node v14.13.0+

```sh
npm install @intrnl/srv
# pnpm install @intrnl/srv
# yarn add @intrnl/srv
```

### Basic server

```js
import * as http from 'http';
import { Application } from '@intrnl/srv';

let app = new Application();

app.use(({ request, response }) => {
  response.body = 'Hello, world!';
});

http.createServer(app.handler).listen(1234);
```

### JSON echo server

```js
import { Application } from '@intrnl/srv';
import { rawBody } from '@intrnl/srv/middlewares/raw-body';
import { json } from '@intrnl/srv/middlewares/body-parser';

let app = new Application();

app.use(rawBody(), json());

app.use(({ request, response }) => {
  if (request.method == 'POST') {
    response.body = { type: 'echo', body: request.body };
  } else {
    response.status = 405;
    response.headers.append('allow', 'post');
  }
});
```

### Routing

```js
import { Application, Router } from '@intrnl/srv';

let router = new Router();
  .route('GET', '/', ({ response }) => {
    response.body = 'Hello, world!';
  });
  .route('GET', '/:id', ({ request, response }) => {
    response.body = `Hello, ${request.params.id}`;
  });

let app = new Application()
  .use(router.handler);
```

### Nested/Subrouting

It is recommended that you mount nested routers first before adding any
additional routes

```js
import { Application, Router } from '@intrnl/srv';

let forum = new Router()
  .route('GET', '/', ({ response }) => {
    response.body = 'Welcome to forum!';
  })
  .route('GET', '/:id', ({ request, response }) => {
    response.body = `Welcome to ${request.params.id} board!`;
  });

let main = new Router()
  .mount('/forum', forum.handler)
  .route('GET', '/', ({ response }) => {
    response.body = 'Hello, world!';
  });

let app = new Application()
  .use(main);
```
