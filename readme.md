
# hyperapp-persist

> Persist an app's state between sessions

Use this [Hyperapp](https://github.com/hyperapp/hyperapp) HOA (Higher-Order App) to persist the state between sessions.  As the page unloads the state is saved in `localStorage`, and then the it is restored on the next load.

<!-- Add screencast demo -->

## Install

```sh
npm i hyperapp-persist
```

## Usage

### `persist(app, options)`

Persist is a Higher-Order App that bootstraps the `app()`.

The options required are:

 - `storage` where the state is saved on `localStorage`
 - `include` to specify what state gets saved

```js
import { app } from 'hyperapp'
import persist from 'hyperapp-persist'

app = persist(app, {
  storage: 'my-app/v1',
  include: [ 'router', 'player' ]
})

app({
  // ...
})
```

Also possible to use environment variables to remove it in production:

```js
if (process.env.DEV) {
  app = persist(app, { ... })
}
```

### Versioning the storage

Sometimes when developing an app, you'll change the state in a way incompatible with what all your users have saved.  In this case, it is recommended you version the `storage` key.  For example:

```js
app = persist(app, {
  storage: 'my-app/1',
  include: [ 'inputs', 'router', ... ]
})
```

Then if a breaking change is made you increment the number to `my-app/2` and so on.


