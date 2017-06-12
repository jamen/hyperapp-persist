
module.exports = function persist () {
  // Return plugin
  return {
    state: {
      previous: JSON.parse(localStorage.getItem('hyperapp-persist-state'))
    },
    actions: {
      saveSessionState: (state) => {
        localStorage.setItem('hyperapp-persist-state', JSON.stringify(state, noPrevious))
      }
    },
    events: {
      loaded: function (state, actions) {
        // Save state on close, minus `lastState` prop to avoid keeping every history
        window.addEventListener('unload', function () {
          actions.saveSessionState()
        })
      }
    }
  }
}

function noPrevious (key, value) {
  if (key === 'previous') return
  else return value
}
