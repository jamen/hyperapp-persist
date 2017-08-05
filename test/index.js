var { h, app } = require('hyperapp')
var persist = require('../')

app({
  // Load persist plugin
  mixins: [
    persist({
      ignore: [ 'other' ],
      storage: 'hyperapp-testing',
    })
  ],

  // (App state as normal)
  state: {
    count: 0,
    input: 'foobar',
    other: 'this should not apear in local storage'
  },

  actions: {
    // Your action that restores previous state into the current state
    restore: (state, actions, previous) => ({
      count: previous.count,
      input: previous.input
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
    persist: (state, actions, previous) => {
      actions.restore(previous)
    },
    'persist:failed': (state, actions, previous) => {
      console.log(previous)
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
