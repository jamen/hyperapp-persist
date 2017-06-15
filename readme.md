
# hyperapp-persist

> Persist an app's state to the next session

A [hyperapp](https://github.com/hyperapp/hyperapp) [plugin](https://github.com/hyperapp/hyperapp/blob/master/docs/core.md#plugins) that stores the app's state using [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) [on `unload`](https://developer.mozilla.org/en-US/docs/Web/Events/unload) so you are able to restore some from `state.previous` next session.  For example: page location, video/audio player time, checkout list, unsaved user input, HRM, etc.

When the previous state becomes incompatible with the current state, `state.version` is incremented.  By default `state.previous` will be tossed if the versions aren't equal, and the user starts from scratch.  But if you require more strict support, you can pass `opts.rescue` and restore the state by verison.

## Install

```sh
npm i -g hyperapp-persist
```

Use [Browserify](http://npmjs.com/browserify) (or a similar package) to bundle for the browser.

## Usage

Start by loading persist in `plugins`

```js
var { h, app } = require('hyperapp')
var persist = require('hyperapp-persist')

app({
  // Load persist plugin
  plugins: [ persist() ],
```

Then define a normal app state

```js
  state: {
    count: 0,
    input: 'foobar',
  },
```

Define an action that restores values from `state.previous`

```js
  actions: {
    // Your action that restores previous state into the current state
    restorePreviousState: state => ({
      count: state.previous.count,
      input: state.previous.input
    }),
  
    increment: state =>
      ({ count: state.count + 1 }),

    decrement: state =>
      ({ count: state.count - 1 }),

    input: (state, _a, value) =>
      ({ input: value })
  },
```

Then when the app loads, check if there was a previous session and restore it

```js
  events: {
    loaded: (state, actions) => {
      // If there was a previous session, restore it
      if (state.previous) actions.restorePreviousState()
    }
  },
```

And a view to tie it together

```js
  view: (state, actions) =>
    <div class='counter'>
      <button onclick={actions.increment}>+</button>
      <span>{state.count}</span>
      <button onclick={actions.decrement}>-</button>
      <br />
      <input
        type='text'
        oninput={e => actions.input(e.target.value)}
        value={state.input} />
    </div>
})
```

See [test/index.js](test/index.js) for another example with more.

### `persist(opts?)`

A plugin that saves state in `localStorage` when the app exits, to be accessed next session as `state.previous`

```js
app({
  plugins: [ persist() ],
  // ...
})
```

You can provide the options

 - `storage`: The name on `localStorage` where state is saved.  Defaults to `hyperapp-persist-state`
 - `ignore`: An array of keys which are not saved or restored between sessions
 - `rescue`: Opts-out of starting a new state when the previous state is incompatible, so you can rescue it

### `state.previous`

The `state` object from the previous session.  Used inside actions to restore it into the current session's state.

If there is no state from the previous session (i.e. a new user, cache cleared) then `state.previous` will be `null`.  It will also be `null` if `opts.rescue` is not enabled and `state.version !== `state.previous.version`.`

```js
restorePlayerTime: (state) =>
  ({ player: { time: state.previous.player.time } })
```

### `state.version`

A number that is incremented and saved when the previous state becomes incompatible with the current state.  i.e. properties are removed or added.

You can use this to restore older states into a new state by passing `opts.rescue`.  Otherwise it is used to automatically invalidate `state.previous` so you don't accidently try and restore and outdated object.

```js
if (!state.previous) {
  // The session has no previous state
} else if (state.version === state.previous.version) {
  // The previous state is compatible with the current state
} else {
  // The saved state is not compatible, rescue versions individually
  switch (state.previous.version) {
    case 1: ...
    case 2: ...
    // ...
  }
}
```

