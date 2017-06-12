var { h, app } = require('hyperapp')
var persist = require('../')

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
  
    up: ({ counter }) => ({ counter: counter + 1 }),
    down: ({ counter }) => ({ counter: counter - 1 }),
  },

  // Run the action when the app loads
  events: {
    loaded: (state, actions) => {
      if (state.previous) actions.restorePreviousState()
    }
  },

  view: (state, actions) =>
    <div class='counter'>
      <button onclick={actions.up}>+</button>
      <span>{state.counter}</span>
      <button onclick={actions.down}>-</button>
    </div>
})
