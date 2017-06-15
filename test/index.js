var { h, app } = require('hyperapp')
var persist = require('../')

app({
  // Load persist plugin
  plugins: [
    persist({
      storage: 'test',
      ignore: [ 'other' ]
    })
  ],

  // (App state as normal)
  state: {
    count: 0,
    input: 'foobar',
    other: 'this should not apear in local storage',
    // Try adding a property after a few sessions to increment the version. This
    // invalidates the outdated state and tosses it (unless you pass opts.rescue)
    // newState: 123
  },

  actions: {
    // Your action that restores previous state into the current state
    restorePreviousState: state => ({
      count: state.previous.count,
      input: state.previous.input
    }),
  
    // (Other input actions)
    increment: state =>
      ({ count: state.count + 1 }),

    decrement: state =>
      ({ count: state.count - 1 }),

    input: (state, _a, value) =>
      ({ input: value })
  },

  events: {
    loaded: (state, actions) => {
      // If there was a previous session, restore it
      if (state.previous) actions.restorePreviousState()
    }
  },

  // (App view)
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
