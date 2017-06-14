
# hyperapp-persist

> Persist hyperapp state between sessions 

A [hyperapp](https://github.com/hyperapp/hyperapp) [plugin](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#plugins) that provides a way to restore state from a previous session (using [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)).  It simply exposes `state.previous`, and then saves the app state on the [`unload` event](https://developer.mozilla.org/en-US/docs/Web/Events/unload).

```js
var { h, app } = require('hyperapp')
var persist = require('hyperapp-persist')

app({
  plugins: [ persist ],

  // App's initial state state
  state: { count: 0 },

  actions: {
    // Restores the count from the last session
    restorePreviousState: state => 
      ({ count: state.previous.count }),
  
    up: state => ({ count: state.count + 1 }),
    down: state => ({ count: state.count - 1 }),
  },

  // When the app loads, check for a previous state and restore it.
  events: {
    loaded: (state, actions) => {
      if (state.previous) actions.restorePreviousState()
    }
  },

  view: (state, actions) =>
    <div class='counter'>
      <button onclick={actions.up}>+</button>
      <span>{state.count}</span>
      <button onclick={actions.down}>-</button>
    </div>
})
```

## Install

```sh
npm i -g hyperapp-persist
```

Use [Browserify](http://npmjs.com/browserify) (or a similar package) to bundle for the browser.

## Usage

You get `state.previous` to load the previous state into the current state by simply defining a `action`:

```js
restorePreviousState: (state) =>
  ({ counter: state.previous.counter })
```

Then when the app loads, or the user confirms they'd like to restore, run it:

```js
events: {
  loaded: (state, actions) => {
    if (state.previous) actions.restorePreviousState()
  }
}
```

This gives you flexibility about what the persist and when to enable it, while keeping the `localStorage` logic hidden.

### `persist`

The [plugin](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#plugins) function that persists your app state across sessions.  Loaded by:

```js
app({
  plugins: [ persist ],
  // ...
})
```

It exposes `state.previous` for you to create an action, and also `actions.saveSessionState` which is ran automatically when your app exits.

### `state.previous`

The `state` object from the previous session.  Used inside actions to restore it into the current session's state.

```js
restorePlayerTime: (state) =>
  ({ player: { time: state.previous.player.time } })
```

If there is no state from the previous session (i.e. a new user, or cache cleared) then `state.previous` will be `null`.  Check this before running the restore action, so you don't try and restore the current state to nothing.

### `actions.saveSessionState`

An action that forces a session state save.  Note that **you don't need this** since it is automatically executed by the `persist` plugin when your app exits.

```js
// What is implemented in `persist`
window.addEventListener('unload', function () {
  actions.saveSessionState()
})
```

