# console-mirror

Drop in fontend for apps without one! Mirrors the server-side console output to the client side.

## Usage

```js
  require('console-mirror')().listen();
```

### Config

With an existing [express](http://expressjs.com) server:

```js
  let app = express();
  require('console-mirror')({ app });
```

To serve the console on a different path:

```js
  // console will served at /console/
  require('console-mirror')({ clientPath: 'console' });
```

To serve the entire console on a sub-path:

```js
  let app = express();
  // console will served at /console/
  app.use('/console', require('console-mirror')());
```
