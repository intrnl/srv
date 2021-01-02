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

```js
import * as http from 'http';
import { Application } from '@intrnl/srv';

let app = new Application();

app.mount('/', async ({ request, response }, next) => {
  await next();

  response.body // -> { message: 'Hello world!' }
  response.type // -> 'application/json'
});

app.route('get', '/', async ({ request, response }) => {
  response.body = { message: 'Hello world!' };
});

let server = http.createServer(app.handler);
server.listen(80);
```
