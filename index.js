
module.exports = function persist (options) {
  if (!options) options = {}

  var ignore = options.ignore || []
  var storage = options.storage || 'hyperapp-persist'

  function ignoreInStorage (key, value) {
    if (key !== 'previous' && ignore.indexOf(key) === -1) return value
  }
  
  // Load the previous state from local storage
  var previous = null
  try {
    var data = localStorage.getItem(storage)
    if (data) previous = JSON.parse(data)
  } catch (err) {
    emit('error', err)
  }

  // Clear whatever state was saved, so it doesn't bleed through
  if (!options.keep) localStorage.removeItem(storage)

  // A side-effect independent of the state, so we can cancle the saving of it
  var canceled = false

  return function (emit) {
    return {
      actions: {
        persist: {
          cancel: function (state) {
            canceled = true
          },
          save: function (state) {
            localStorage.setItem(storage, JSON.stringify(state, ignoreInStorage))
          }
        }
      },
      events: {
        init: function (state, actions) {
          // Trigger proper event, checking compatibility
          var evt = incompatible(state, previous, ignore)
            ? 'persist:failed'
            : 'persist'
          emit(evt, previous)

          // Save state on app exit
          window.addEventListener('unload', function () {
            if (!canceled) actions.persist.save()
          })
        }
      }
    }
  }
}

function incompatible (state, previous, ignore) {
  if (state === null || previous === null) {
    return state === previous
  }

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

