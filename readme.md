
# hyperapp-persist

> Persist hyperapp state between sessions 

A [hyperapp](https://github.com/hyperapp/hyperapp) [plugin](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#plugins) that stores state from the user's previous session using [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), so you are able to bring some back to the current state.  For example: page location, video/audio player time, checkout list, unsaved user input, etc.  It simply provides `state.previous` and saves the current state [on `unload`](https://developer.mozilla.org/en-US/docs/Web/Events/unload) (becoming previous on the next load).

```js
var { h, app } = require('hyperapp')
var persist = require('hyperapp-persist')

app({
  plugins: [ persist ],

  state: { count: 0 },

  actions: {
    // Restores the count from the previous session
    restorePreviousState: state => 
      ({ count: state.previous.count }),
  
    up: state => ({ count: state.count + 1 }),
    down: state => ({ count: state.count - 1 }),
  },

  // Restore the count when the app loads
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
npm i hyperapp-persist
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

This lets you choose which state to persist and when to enable it, while keeping the `localStorage` logic hidden.

### `persist`

Loads the `localStorage` + `unload` code to persist your state between session as `state.previous`

```js
app({
  plugins: [ persist ],
  // ...
})
```

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
