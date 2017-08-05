
# hyperapp-persist

> Persist an app's state to the next session

A [HyperApp](https://github.com/hyperapp/hyperapp) [mixin](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#mixins) that stores state in [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) on [`window.unload`](https://developer.mozilla.org/en-US/docs/Web/Events/unload) so you can restore it next the session. For example: media player state, checkout items list, or unsaved forms or inputs.

```js
mixin: [
  persist()
]
```

Then, get a `persist` event containing the previous state:

```js
events: {
  persist: (state, actions, previous) => {
    actions.restore(previous)
  }
}
```

M
Learn more about the mixin in [Usage section](#usag

## Install

```sh
npm i hyperapp-persist
```

Use [Browserify](http://npmjs.com/browserify) (or a similar package) to bundle for the browser.

## Usage

### `persist(options?)`

Mixin that persists the state given `options` (not required).

 - `ignore` (`Array`): Keys on the `state` you don't want to persist. Defaults to none
 - `storage` (`String`): Where state is saved on `localStorage`. Defaults to `'hyperapp-persist'`

```js
app({
  mixin: [ persist() ]
})
```

Or with options:

```js
app({
  mixin: [
   persist({
      ignore: [ 'secrets' ],
      storage: 'hyperapp-persist'
    })
  ]
})
```

### `persist` event

Emitted when there is a previous state and it can be restored.

Comes with a `previous` parameter, which you pass off into one of your own actions.

```js
actions: {
  restore: (state, actions, previous) => ({
    count: previous.count,
    input: previous.input,
    // ...
  })
},
events: {
  persist: (state, actions, previous) => {
    actions.restore(previous)
  }
}
```

### `persist:failed` event

Emitted when there is a previous state but it is incompatible with the current state.

```js
events: {
  persist: (_, actions, previous) => actions.restore(previous),
  'persist:failed': (_, actions, previous) => {
    // Incompatible states.  Guess some old state keys?
  }
}
```

It is not required to use this.  Without it, the user starts from scratch and the incompatible state is never utilzied.

### `actions.persist.cancel()`

Prevents the state from saving this session

### `actions.persist.save()`

Saves the state manually.  This is triggered automatically with `window.onunload` event

