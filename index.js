
module.exports = function (app, opts) {
  return function (props) {
    opts = opts || {}
    var version = opts.version
    var storage = opts.storage || 'hyperapp-persist'
    var include = opts.include || []
    var _init = props.init

    var dbPromise = indexedDB.open(storage, version, function (dbUpgrade) {
      if (!dbUpgrade.objectStoreNames.contains('state')) {
        dbUpgrade.createObjectStore('state', { autoIncrement: true })
      }
    })

    props.init = function (state, actions) {
      if (_init) _init.apply(null, arguments)

      dbPromise.then(function (db) {
        var tx = db.transaction('state', 'readonly')
        var store = tx.objectStore('state')

        return store.getAll()
      }).then(function (items) {
        var data = items[0]
        if (data) actions.__restore(data)

        window.addEventListener('unload', function () {
          actions.__save()
        })
      })
    }

    props.actions.__restore = function (_s, _a, previous) {
      return previous
    }

    props.actions.__save = function (state) {
      localStorage.setItem(storage, JSON.stringify(state, include))
    }

    return app(props)
  }
}
