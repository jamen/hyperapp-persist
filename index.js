
module.exports = function persist (options) {
  if (!options) options = {}

  var ignore = options.ignore
  var rescue = options.rescue
  var storage = options.storage || 'hyperapp-persist-state'

  function ignoreOnSave (key, value) {
    if (key !== 'previous' && ignore.indexOf(key) === -1) return value
  }
  
  return function (app) {
    var previous = JSON.parse(localStorage.getItem(storage))
    var version = previous ? previous.version : 0

    return {
      state: {
        previous: previous,
        version: version
      },
      actions: {
        _saveSessionState: function (state) {
          localStorage.setItem(storage, JSON.stringify(state, ignoreOnSave))
        },
        _newStateVersion: function (state) {
          return {
            version: state.version + 1,
            previous: rescue ? state.previous : null
          }
        }
      },
      events: {
        loaded: function (state, actions) {
          // Check if states are incompatible, and create a new verison
          if (incompatible(state, state.previous, ignore)) {
            actions._newStateVersion()
          }

          // Save state on app exit
          window.addEventListener('unload', function () {
            actions._saveSessionState()
          })
        }
      }
    }
  }
}

function incompatible (state, previous, ignore) {
  if (typeof state !== 'object' || typeof previous !== 'object') {
    return typeof state === typeof previous
  }

  for (var prop in state) {
    if (ignore && ignore.indexOf(prop) !== -1) {
      continue
    }

    var value = state[prop]
    var old = previous[prop]
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (incompatible(value, old)) return true
    } else if (!old) {
      return true
    } 
  }
}

