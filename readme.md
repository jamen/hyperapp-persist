
# hyperapp-persis

> Persist hyperapp state between sessions 

A [hyperapp plugin](https://github.com/hyperapp/hyperapp) that provides an way to restore state from a previous session (using [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)).  It simply exposes `state.previous`, and then saves the app state on the [`unload` event](https://developer.mozilla.org/en-US/docs/Web/Events/unload).

```js
var { h, app } = require('hyperapp')
var persist = require('hypeerapp-persist')

app({
  // Load persist + any other plugins
  plugins: [ persist ],

  // Define a state as normal
  state: {
    counter: 0
  },

  actions: {
    // Restore state from previous session using `state.previous`
    restorePreviousState: state => 
      ({ counter: state.previous.counter }),
  
    // Counter actions
    up: ({ counter }) => ({ counter: counter + 1 }),
    down: ({ counter }) => ({ counter: counter - 1 }),
  },

  events: {
    loaded: (state, actions) => {
      // Restore a previous state when app loads
      if (state.previous) actions.restorePreviousState()
    }
  },

  // View counter
  view: (state, actions) =>
    <div class='counter'>
      <button onclick={actions.up}>+</button>
      <span>{state.counter}</span>
      <button onclick={actions.down}>-</button>
    </div>
})
```

## Install

```sh
npm i -g hyperapp-persist
```

Use [Browserify](http://npmjs.com/browserify) (and similar) to bundle for the browser.

## Usage

This plugin only gives you `state.previous`, and your job is to load the previous state into your new state how you like.  This is not difficult at all.  Just define [an a new action](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#actions) to restores the state:

```js
restorePreviousState: (state) =>
  ({ counter: state.previous.counter })
```

Then run this when the app loads

```js
events: {
  loaded: (state, actions) => {
    if (state.previous) actions.restorePreviousState()
    // ...
  }
}
```

Making sure to check that `state.previous` exists.

### `persist`

The [plugin](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#plugins) that persists your app state across sessions.  Loaded by:

```js
app({
  plugins: [ persist ],
  // ...
})
```

It exposes `state.previous` and `actions.saveSessionState`, and saves your app state on `unload`.

### `state.previous`

The state object of the previous session.  Used inside actions to "restore" the last session:

```js
restorePlayerTime: (state) =>
  ({ player: { time: state.previous.player.time } })
```

### `actions.saveSessionState`

An action that forces a session state save.  Note that **you don't need this** since it is automatically executed by the `persist` plugin when your app exits.

```
// What is implemented in `persis`
window.addEventListener('unload', function () {
  actions.saveSessionState()
})
```

